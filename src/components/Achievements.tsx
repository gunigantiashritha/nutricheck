
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, Scan, Apple } from 'lucide-react';
import { useUser } from "@/services/UserContext";

const Achievements = () => {
  const { healthProfile, safeFoodCount } = useUser();
  const { scanHistory, achievements } = healthProfile;

  // Calculate total achievements unlocked
  const totalAchievements = Object.values(achievements).filter(Boolean).length;
  const maxAchievements = Object.keys(achievements).length;

  const achievementsList = [
    {
      title: "First Scan",
      description: "Scan your first nutrition label",
      icon: <Scan className="h-4 w-4" />,
      unlocked: achievements.firstScan,
      progress: achievements.firstScan ? 100 : scanHistory.count > 0 ? 100 : 0,
    },
    {
      title: "Consistent Checker",
      description: "Use the app 3 days in a row",
      icon: <Calendar className="h-4 w-4" />,
      unlocked: achievements.threeDayStreak,
      progress: Math.min((scanHistory.streak / 3) * 100, 100),
    },
    {
      title: "Safe Food Finder",
      description: "Find 5 products that are safe for your health",
      icon: <Apple className="h-4 w-4" />,
      unlocked: achievements.fiveSafeProducts,
      progress: Math.min((safeFoodCount / 5) * 100, 100),
    },
    {
      title: "Nutrition Expert",
      description: "Scan 10 different products",
      icon: <Award className="h-4 w-4" />,
      unlocked: achievements.tenScans,
      progress: Math.min((scanHistory.count / 10) * 100, 100),
    }
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-health-blue" />
            Your Achievements
          </span>
          <Badge variant="outline" className="ml-auto">
            {totalAchievements}/{maxAchievements}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track your progress and earn badges as you use NutriCheck
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievementsList.map((achievement, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`p-1 rounded-full mr-2 ${achievement.unlocked ? 'bg-health-blue/20 text-health-blue' : 'bg-gray-100 text-gray-400'}`}>
                    {achievement.icon}
                  </span>
                  <span className={`text-sm font-medium ${achievement.unlocked ? 'text-health-blue' : 'text-gray-600'}`}>
                    {achievement.title}
                  </span>
                </div>
                <Badge variant={achievement.unlocked ? "default" : "outline"} className={achievement.unlocked ? "bg-health-blue" : ""}>
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={achievement.progress} className="h-2" />
                <span className="text-xs text-gray-500 min-w-[36px] text-right">
                  {Math.round(achievement.progress)}%
                </span>
              </div>
              <p className="text-xs text-gray-500">{achievement.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
