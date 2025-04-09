
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/services/UserContext';
import { CirclePlus, CircleMinus, CircleCheck } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAnalysis } from '@/services/AnalysisContext';

const HealthDashboard: React.FC = () => {
  const { healthProfile, safeFoodCount } = useUser();
  const { productHistory } = useAnalysis();
  
  // Calculate scan statistics
  const safeProducts = safeFoodCount || 0;
  const cautionProducts = healthProfile.scanHistory.count - safeProducts;
  
  const data = [
    { name: 'Safe', value: safeProducts, color: '#22c55e' },
    { name: 'Caution/Avoid', value: cautionProducts, color: '#f59e0b' }
  ];
  
  const COLORS = ['#22c55e', '#f59e0b'];

  // Calculate streak data
  const currentStreak = healthProfile.scanHistory.streak || 0;
  const totalScans = healthProfile.scanHistory.count || 0;
  
  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold">Your Health Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CircleCheck className="h-4 w-4 text-green-500 mr-2" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
            <p className="text-xs text-muted-foreground">Keep scanning daily!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CirclePlus className="h-4 w-4 text-blue-500 mr-2" />
              Total Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
            <p className="text-xs text-muted-foreground">Products analyzed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CircleMinus className="h-4 w-4 text-purple-500 mr-2" />
              Best Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
            <p className="text-xs text-muted-foreground">Your best streak</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Product Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ChartContainer
              config={{
                safe: {
                  label: "Safe Products",
                  color: "#22c55e"
                },
                caution: {
                  label: "Caution/Avoid",
                  color: "#f59e0b"
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-2 flex justify-center">
            <ChartLegend payload={data.map((item, index) => ({ 
              value: item.name, 
              color: COLORS[index % COLORS.length]
            }))} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthDashboard;
