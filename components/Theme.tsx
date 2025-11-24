'use client';
import { useEffect } from 'react';

export function ThemeScript(){
  useEffect(()=>{
    const t = localStorage.getItem('theme') || 'ctrl';
    const el = document.querySelector('[data-theme]');
    if (el) el.setAttribute('data-theme', t);
  }, []);
  return null;
}
