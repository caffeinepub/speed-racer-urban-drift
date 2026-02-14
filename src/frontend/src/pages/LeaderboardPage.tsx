import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import { useGetTopScores, useGetPlayerScores } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LEVELS } from '../game/levels';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: topScores = [], isLoading: topLoading } = useGetTopScores(10);
  const { data: playerScores = [], isLoading: playerLoading } = useGetPlayerScores(identity?.getPrincipal());

  const formatScore = (score: bigint) => Number(score).toLocaleString();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  const getLevelName = (level: string) => {
    const levelConfig = Object.values(LEVELS).find(l => l.id === level);
    return levelConfig?.name || level;
  };

  return (
    <div 
      className="min-h-screen p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/assets/generated/bg-neon-night.dim_1920x1080.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="ghost"
            className="text-neon-cyan"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
          <h1 className="text-4xl font-black neon-text">
            <Trophy className="inline mr-2 h-8 w-8" />
            LEADERBOARD
          </h1>
          <div className="w-32" />
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50">
            <TabsTrigger value="global">Global Top Scores</TabsTrigger>
            <TabsTrigger value="personal" disabled={!identity}>
              Personal Best
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <Card className="bg-black/80 border-neon-cyan/30">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Top 10 Racers</CardTitle>
              </CardHeader>
              <CardContent>
                {topLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : topScores.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No scores yet. Be the first!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topScores.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-bold">
                            {index === 0 && <Trophy className="inline h-5 w-5 text-yellow-500 mr-1" />}
                            {index === 1 && <Medal className="inline h-5 w-5 text-gray-400 mr-1" />}
                            {index === 2 && <Medal className="inline h-5 w-5 text-orange-600 mr-1" />}
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {entry.player.toString().slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getLevelName(entry.level)}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-neon-orange">
                            {formatScore(entry.score)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {formatDate(entry.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal">
            <Card className="bg-black/80 border-neon-purple/30">
              <CardHeader>
                <CardTitle className="text-neon-purple">Your Best Scores</CardTitle>
              </CardHeader>
              <CardContent>
                {playerLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : playerScores.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No personal scores yet. Start racing!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playerScores.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant="outline">{getLevelName(entry.level)}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-neon-orange">
                            {formatScore(entry.score)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {formatDate(entry.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
