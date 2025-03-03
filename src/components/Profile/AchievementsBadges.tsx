'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress
} from '@mui/material';
import {
  EmojiEvents,
  Verified,
  Psychology,
  LocalHospital,
  School,
  AccessTime,
  Favorite,
  Star,
  Info
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  color: string;
  progress: number;
  achieved: boolean;
  dateAchieved?: Date;
}

export function AchievementsBadges() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Verified Professional',
      description: 'Completed background check and certification verification',
      icon: <Verified />,
      color: '#4CAF50',
      progress: 100,
      achieved: true,
      dateAchieved: new Date('2024-12-01')
    },
    {
      id: '2',
      name: 'Experience Master',
      description: '5+ years of professional caregiving experience',
      icon: <EmojiEvents />,
      color: '#FFC107',
      progress: 100,
      achieved: true,
      dateAchieved: new Date('2024-11-15')
    },
    {
      id: '3',
      name: 'Empathy Expert',
      description: 'Consistently high ratings for empathy and understanding',
      icon: <Psychology />,
      color: '#2196F3',
      progress: 85,
      achieved: false
    },
    {
      id: '4',
      name: 'Medical Proficient',
      description: 'Completed advanced medical care training',
      icon: <LocalHospital />,
      color: '#F44336',
      progress: 100,
      achieved: true,
      dateAchieved: new Date('2025-01-10')
    },
    {
      id: '5',
      name: 'Continuous Learner',
      description: 'Regularly participates in professional development',
      icon: <School />,
      color: '#9C27B0',
      progress: 75,
      achieved: false
    },
    {
      id: '6',
      name: 'Reliability Champion',
      description: 'Perfect attendance and punctuality record',
      icon: <AccessTime />,
      color: '#FF9800',
      progress: 90,
      achieved: false
    },
    {
      id: '7',
      name: 'Client Favorite',
      description: 'Received multiple client commendations',
      icon: <Favorite />,
      color: '#E91E63',
      progress: 100,
      achieved: true,
      dateAchieved: new Date('2025-02-01')
    },
    {
      id: '8',
      name: 'Excellence Award',
      description: 'Maintained 5-star rating for 6 months',
      icon: <Star />,
      color: '#673AB7',
      progress: 95,
      achieved: false
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Paper 
        sx={{ 
          p: 3,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Achievements & Badges</Typography>
          <Tooltip title="Earn badges by providing excellent care and maintaining high standards">
            <IconButton>
              <Info />
            </IconButton>
          </Tooltip>
        </Box>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Grid container spacing={2}>
            {badges.map((badge) => (
              <Grid item xs={6} sm={4} md={3} key={badge.id}>
                <motion.div variants={item}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      },
                      opacity: badge.achieved ? 1 : 0.7,
                      position: 'relative'
                    }}
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <Box
                      sx={{
                        color: badge.color,
                        mb: 1,
                        '& svg': {
                          fontSize: '2rem'
                        }
                      }}
                    >
                      {badge.icon}
                    </Box>
                    <Typography variant="body2" noWrap>
                      {badge.name}
                    </Typography>
                    {!badge.achieved && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={badge.progress}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: badge.color
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Paper>

      <Dialog
        open={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        maxWidth="xs"
        fullWidth
      >
        {selectedBadge && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ color: selectedBadge.color }}>
                  {selectedBadge.icon}
                </Box>
                {selectedBadge.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                {selectedBadge.description}
              </Typography>
              {selectedBadge.achieved ? (
                <Typography variant="body2" color="success.main">
                  ✓ Achieved on {selectedBadge.dateAchieved?.toLocaleDateString()}
                </Typography>
              ) : (
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Progress: {selectedBadge.progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedBadge.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: selectedBadge.color
                      }
                    }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedBadge(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
