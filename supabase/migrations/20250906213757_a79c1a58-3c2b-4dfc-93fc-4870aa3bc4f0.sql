-- Update existing store settings with the default background video
UPDATE store_settings 
SET background_video = 'src/assets/background-video.mp4'
WHERE background_video = '' OR background_video IS NULL;