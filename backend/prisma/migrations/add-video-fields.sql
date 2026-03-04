-- 添加 videoUrl 字段到 Exercise 表
-- Migration: Add Video URL Support

-- 1. 添加 videoUrl 字段
ALTER TABLE exercises ADD COLUMN videoUrl TEXT DEFAULT '';

-- 2. 添加 videoSource 字段（视频来源）
ALTER TABLE exercises ADD COLUMN videoSource TEXT DEFAULT 'custom';

-- 3. 添加 videoAuthor 字段（视频作者）
ALTER TABLE exercises ADD COLUMN videoAuthor TEXT DEFAULT '';

-- 4. 添加 videoDuration 字段（视频时长，单位秒）
ALTER TABLE exercises ADD COLUMN videoDuration INTEGER DEFAULT 0;

-- 说明：
-- videoSource 可选值：'xiaohongshu', 'douyin', 'bilibili', 'custom'
-- videoUrl: 视频播放地址或页面地址
-- videoAuthor: 视频创作者名称
-- videoDuration: 视频时长（秒）
