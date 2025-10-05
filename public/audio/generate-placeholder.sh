#!/bin/bash

# Script to generate a silent MP3 placeholder
# This creates a 10-second silent audio file

echo "Creating silent audio placeholder..."

# Using ffmpeg to create silent audio (if available)
if command -v ffmpeg &> /dev/null; then
    ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 10 -q:a 9 -acodec libmp3lame background-music.mp3
    echo "✅ Silent audio file created successfully!"
    echo "📝 Replace this file with your actual background music"
else
    echo "⚠️  ffmpeg not found. Please install ffmpeg or manually add your music file."
    echo "📝 Place your music file as: public/audio/background-music.mp3"
fi
