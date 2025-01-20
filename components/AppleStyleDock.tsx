'use client'

import { Activity, Component, HomeIcon, Mail, Package, ScrollText, SunMoon } from 'lucide-react';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const data = [
  {
    title: 'Home',
    icon: (
      <HomeIcon className='h-full w-full text-green-500' />
    ),
    href: '#',
  },
  {
    title: 'Assets',
    icon: (
      <Package className='h-full w-full text-green-500' />
    ),
    href: '#',
  },
  {
    title: 'Trade',
    icon: (
      <Component className='h-full w-full text-green-500' />
    ),
    href: '#',
  },
  {
    title: 'Activity',
    icon: (
      <Activity className='h-full w-full text-green-500' />
    ),
    href: '#',
  },
  {
    title: 'News',
    icon: (
      <ScrollText className='h-full w-full text-green-500' />
    ),
    href: '#',
  },
  {
    title: 'Messages',
    icon: (
      <Mail className='h-full w-full text-green-500' />
    ),
    href: '#',
  },
  {
    title: 'Settings',
    icon: (
      <SunMoon className='h-full w-full text-green-500' />
    ),
    href: '#',
  },
];

export function AppleStyleDock() {
  return (
    <div className='absolute bottom-2 left-1/2 max-w-full -translate-x-1/2'>
      <Dock className='items-end pb-3'>
        {data.map((item, idx) => (
          <DockItem
            key={idx}
            className='aspect-square rounded-full bg-black border border-green-500'
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}

