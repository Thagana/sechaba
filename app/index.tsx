import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/supabase/supabase';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/(tabs)' : '/(auth)/login');
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      router.replace(session ? '/(tabs)' : '/(auth)/login');
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  if (loading) return <View><ActivityIndicator size="large" /></View>;

  return null;
}
