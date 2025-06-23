import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://obrhuhasrppixjwkznri.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icmh1aGFzcnBwaXhqd2t6bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDYyNzgsImV4cCI6MjA2NDA4MjI3OH0.BEso8xpPQBPBMwWFLLyM7npDMxHdEjv-pe9Q2HVU_cY'
);

const TestRealtime = () => {
  useEffect(() => {
    const userId = 8;

    const channel = supabase
      .channel(`test-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('📨 LIVE Notification Received:', payload.new);
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Realtime status:', status, err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>✅ Listening to Notifications for User ID: 8</h2>
      <p>Open the console and insert a new notification to test Realtime.</p>
    </div>
  );
};

export default TestRealtime;
