import React, { useState } from 'react';
import { useWeight } from '../context/WeightContext';
import DashboardCard from '../components/ui/DashboardCard';
import Button from '../components/ui/Button';
import { Share2, Download, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';

const ShareProgress: React.FC = () => {
  const { entries, goal } = useWeight();
  const [copied, setCopied] = useState(false);
  
  // Calculate progress stats
  const calculateStats = () => {
    if (entries.length < 2) return null;
    
    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];
    const totalChange = lastEntry.weight - firstEntry.weight;
    const percentChange = (totalChange / firstEntry.weight) * 100;
    
    return {
      totalChange,
      percentChange,
      daysTracked: entries.length,
      goalProgress: goal ? ((lastEntry.weight - goal.target) / (firstEntry.weight - goal.target)) * 100 : null
    };
  };

  const stats = calculateStats();
  
  const generateShareText = () => {
    if (!stats) return '';
    
    return `I've been tracking my weight with WeightTrack! 💪\n\n` +
           `📊 Total Change: ${stats.totalChange.toFixed(1)}kg (${stats.percentChange.toFixed(1)}%)\n` +
           `📅 Days Tracked: ${stats.daysTracked}\n` +
           (stats.goalProgress ? `🎯 Goal Progress: ${stats.goalProgress.toFixed(1)}%\n` : '') +
           `\nStart your weight tracking journey today!`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=My Weight Tracking Progress&body=${text}%0A%0A${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Share Your Progress</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Share2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
            Quick Share
          </h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleShare('twitter')}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8]"
              >
                <Twitter size={16} className="mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={() => handleShare('facebook')}
                className="bg-[#4267B2] hover:bg-[#365899]"
              >
                <Facebook size={16} className="mr-2" />
                Facebook
              </Button>
              
              <Button
                onClick={() => handleShare('linkedin')}
                className="bg-[#0077B5] hover:bg-[#006399]"
              >
                <Linkedin size={16} className="mr-2" />
                LinkedIn
              </Button>
              
              <Button
                onClick={() => handleShare('email')}
                className="bg-gray-600 hover:bg-gray-700"
              >
                <Mail size={16} className="mr-2" />
                Email
              </Button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
              />
              <Button
                onClick={handleCopyLink}
                className={copied ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-700'}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Download className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
            Export Data
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Download your weight tracking data in various formats
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  const csv = entries
                    .map(e => `${e.date},${e.weight},${e.note || ''}`)
                    .join('\n');
                  const blob = new Blob([`Date,Weight,Note\n${csv}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'weight-tracking-data.csv';
                  a.click();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Export as CSV
              </Button>
              
              <Button
                onClick={() => {
                  const json = JSON.stringify(entries, null, 2);
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'weight-tracking-data.json';
                  a.click();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Export as JSON
              </Button>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard>
        <h2 className="text-lg font-semibold mb-4">Progress Summary</h2>
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Change</p>
              <p className="text-2xl font-bold">{stats.totalChange.toFixed(1)} kg</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Percent Change</p>
              <p className="text-2xl font-bold">{stats.percentChange.toFixed(1)}%</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Days Tracked</p>
              <p className="text-2xl font-bold">{stats.daysTracked}</p>
            </div>
            
            {stats.goalProgress !== null && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Goal Progress</p>
                <p className="text-2xl font-bold">{stats.goalProgress.toFixed(1)}%</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Add more weight entries to see your progress summary
          </p>
        )}
      </DashboardCard>
    </div>
  );
};

export default ShareProgress;