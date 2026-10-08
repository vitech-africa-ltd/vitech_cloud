// ============================================
// VITECH CLOUD — CHART COMPONENTS
// ============================================

import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '../ui';

// ============================================
// STORAGE USAGE CHART
// ============================================

interface StorageChartProps {
  data: Array<{
    date: string;
    storageUsed: number;
  }>;
  title?: string;
}

export function StorageChart({ data, title = 'Storage Usage' }: StorageChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="h-64 flex items-center justify-center text-surface-500">
            No data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="storageUsed" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorStorage)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================
// ACTIVITY CHART
// ============================================

interface ActivityChartProps {
  data: Array<{
    date: string;
    uploads: number;
    downloads: number;
    deletes: number;
  }>;
  title?: string;
}

export function ActivityChart({ data, title = 'Activity Overview' }: ActivityChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="h-64 flex items-center justify-center text-surface-500">
            No data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="uploads" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="downloads" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="deletes" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================
// FILE TYPES CHART
// ============================================

interface FileTypesChartProps {
  data: Array<{
    type: string;
    count: number;
    size: number;
  }>;
  title?: string;
}

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function FileTypesChart({ data, title = 'File Types Distribution' }: FileTypesChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="h-64 flex items-center justify-center text-surface-500">
            No data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={256}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================
// BAR CHART
// ============================================

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
  color?: string;
}

export function SimpleBarChart({ data, title, color = '#6366f1' }: BarChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
          <div className="h-64 flex items-center justify-center text-surface-500">
            No data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <ResponsiveContainer width="100%" height={256}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
