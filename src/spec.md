# Specification

## Summary
**Goal:** Fix trending topics data fetching from YouTube and Google Trends APIs, and add Hindi language support for script generation.

**Planned changes:**
- Implement backend function to fetch live trending topics from YouTube API with platform identifier, hashtags, keywords, and engagement metrics
- Implement backend function to fetch live trending topics from Google Trends API with similar data structure
- Update TrendingPage frontend to display fetched trending topics organized by platform filter tabs
- Enhance backend AI script generation to support Hindi language while maintaining hook-driven storytelling structure
- Add Hindi language selection option in VideoConfigurationPage with proper font rendering support

**User-visible outcome:** Users can view live trending topics from YouTube and Google Trends on the Trending page, and can generate video scripts in Hindi language for selected trending topics.
