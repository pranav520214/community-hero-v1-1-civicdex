'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Issue, IssueStatus, GeoPoint } from '@/types';
import { geminiService } from '@/lib/gemini';

const ISSUES_COLLECTION = 'issues';

export function useIssues(filters?: { status?: IssueStatus; category?: string; division?: string }) {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: async () => {
      let q = query(collection(db, ISSUES_COLLECTION));
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      // Note: Firestore requires composite indexes for multiple where clauses
      // This is a simplified query - in production you'd need proper indexes
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Issue[];
    },
  });
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const docRef = doc(db, ISSUES_COLLECTION, id);
      // Note: Direct doc fetch would be better but keeping consistency with query pattern
      const q = query(collection(db, ISSUES_COLLECTION), where('__name__', '==', id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const docSnap = snapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Issue;
    },
    enabled: !!id,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
      location: GeoPoint;
      address: string;
      imageUrl?: string;
      reporterId: string;
      reporterName: string;
    }) => {
      // Step 1: Analyze issue with AI if image provided
      let aiAnalysis;
      if (data.imageUrl) {
        try {
          aiAnalysis = await geminiService.analyzeIssue(data.imageUrl, data.description);
        } catch (error) {
          console.error('AI analysis failed:', error);
        }
      }

      // Step 2: Check for duplicates
      const recentIssuesQuery = query(
        collection(db, ISSUES_COLLECTION),
        where('location', '>=', { latitude: data.location.latitude - 0.001, longitude: data.location.longitude - 0.001 }),
        where('location', '<=', { latitude: data.location.latitude + 0.001, longitude: data.location.longitude + 0.001 }),
        limit(10)
      );
      
      const nearbyIssues = await getDocs(recentIssuesQuery);
      const existingIssues = nearbyIssues.docs.map(d => ({
        id: d.id,
        description: d.data().description,
        location: d.data().location,
      }));

      let duplicateCheck;
      try {
        duplicateCheck = await geminiService.detectDuplicate(data.description, data.location, existingIssues);
      } catch (error) {
        console.error('Duplicate detection failed:', error);
      }

      if (duplicateCheck?.isDuplicate) {
        throw new Error(`This issue appears to be a duplicate of report #${duplicateCheck.duplicateId}`);
      }

      // Step 3: Create the issue
      const now = Timestamp.now();
      const issueData = {
        ...data,
        status: 'PENDING' as IssueStatus,
        severity: aiAnalysis?.severity || 'Medium',
        verificationCount: 0,
        priorityScore: 0,
        aiAnalysis: aiAnalysis ? {
          isFraud: aiAnalysis.isFraud,
          fraudReason: aiAnalysis.fraudReason,
          confidenceScore: aiAnalysis.confidenceScore,
        } : undefined,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, ISSUES_COLLECTION), issueData);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      
      return { id: docRef.id, ...issueData };
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Issue> }) => {
      const docRef = doc(db, ISSUES_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', id] });
    },
  });
}

export function useNearbyIssues(location: GeoPoint, radiusKm: number = 1) {
  return useQuery({
    queryKey: ['nearby-issues', location, radiusKm],
    queryFn: async () => {
      // Convert radius to approximate degree difference
      const degreeDiff = radiusKm / 111; // Rough conversion
      
      const q = query(
        collection(db, ISSUES_COLLECTION),
        where('location.latitude', '>=', location.latitude - degreeDiff),
        where('location.latitude', '<=', location.latitude + degreeDiff),
        where('location.longitude', '>=', location.longitude - degreeDiff),
        where('location.longitude', '<=', location.longitude + degreeDiff)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Issue[];
    },
    enabled: !!location,
  });
}
