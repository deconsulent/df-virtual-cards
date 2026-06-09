"use client";

import { useEffect } from 'react';

export default function ViewTracker({ username }: { username: string }) {
  useEffect(() => {
    fetch(`/api/views?username=${username}`, { method: 'POST' }).catch(console.error);
  }, [username]);

  return null;
}
