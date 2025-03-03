'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  ThumbUp,
  ThumbUpOutlined,
  VerifiedUser,
  Sort,
  FilterList
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
  likes: number;
  userHasLiked: boolean;
  serviceType: string;
}

export function ReviewsList({ caregiverId }: { caregiverId: string }) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Smith',
      userAvatar: '/avatars/john.jpg',
      rating: 5,
      comment: 'Sarah was absolutely wonderful with my mother. She is professional, caring, and very attentive to detail.',
      date: new Date('2025-02-28'),
      verified: true,
      likes: 12,
      userHasLiked: false,
      serviceType: 'Personal Care'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Emma Wilson',
      rating: 4.5,
      comment: 'Great caregiver, always on time and very patient. Would recommend!',
      date: new Date('2025-02-25'),
      verified: true,
      likes: 8,
      userHasLiked: true,
      serviceType: 'Medical Assistance'
    }
  ]);

  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    serviceType: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleLikeReview = (reviewId: string) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          likes: review.userHasLiked ? review.likes - 1 : review.likes + 1,
          userHasLiked: !review.userHasLiked
        };
      }
      return review;
    }));
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReviewObj: Review = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: 'Current User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date(),
      verified: true,
      likes: 0,
      userHasLiked: false,
      serviceType: newReview.serviceType
    };

    setReviews([newReviewObj, ...reviews]);
    setSubmitting(false);
    setOpenReviewDialog(false);
    setNewReview({ rating: 5, comment: '', serviceType: '' });
  };

  return (
    <Box>
      {/* Reviews Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" component="h3">
          Client Reviews ({reviews.length})
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenReviewDialog(true)}
          sx={{ 
            background: 'var(--gradient-primary)',
            '&:hover': {
              background: 'var(--gradient-secondary)'
            }
          }}
        >
          Write a Review
        </Button>
      </Box>

      {/* Reviews List */}
      <Stack spacing={2}>
        {reviews.map((review) => (
          <Paper
            key={review.id}
            className="hover-card animate-fade-in"
            sx={{ 
              p: 3,
              borderRadius: 2
            }}
          >
            <Box display="flex" gap={2}>
              <Avatar
                src={review.userAvatar}
                sx={{ width: 48, height: 48 }}
              >
                {review.userName[0]}
              </Avatar>
              
              <Box flex={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" component="span">
                      {review.userName}
                    </Typography>
                    {review.verified && (
                      <Chip
                        icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                        label="Verified Client"
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {format(review.date, 'MMM d, yyyy')}
                  </Typography>
                </Box>

                <Box my={1}>
                  <Rating value={review.rating} precision={0.5} readOnly />
                  <Chip
                    label={review.serviceType}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>

                <Typography variant="body1" paragraph>
                  {review.comment}
                </Typography>

                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => handleLikeReview(review.id)}
                    color={review.userHasLiked ? 'primary' : 'default'}
                  >
                    {review.userHasLiked ? <ThumbUp /> : <ThumbUpOutlined />}
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {review.likes} helpful
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Write Review Dialog */}
      <Dialog 
        open={openReviewDialog} 
        onClose={() => setOpenReviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Typography gutterBottom>Your Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={(_, value) => setNewReview({ ...newReview, rating: value || 5 })}
              size="large"
            />

            <TextField
              select
              fullWidth
              margin="normal"
              label="Service Type"
              value={newReview.serviceType}
              onChange={(e) => setNewReview({ ...newReview, serviceType: e.target.value })}
              SelectProps={{
                native: true
              }}
            >
              <option value="">Select a service</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Medical Assistance">Medical Assistance</option>
              <option value="Companionship">Companionship</option>
              <option value="Mobility Support">Mobility Support</option>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Your Review"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={!newReview.comment || !newReview.serviceType || submitting}
            sx={{ 
              background: 'var(--gradient-primary)',
              '&:hover': {
                background: 'var(--gradient-secondary)'
              }
            }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
