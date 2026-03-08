#!/bin/bash
# 批量下载 B站视频

set -e

VIDEOS_DIR="/Users/aaronan/.openclaw/workspace/projects/zijianfit/backend/public/videos"
cd "$VIDEOS_DIR"

# 设置代理
export https_proxy=http://127.0.0.1:7897
export http_proxy=http://127.0.0.1:7897

# 视频列表 (BV号 -> 本地文件名)
declare -A videos=(
  ["BV1i541157wM"]="chest-press.mp4"      # 哑铃对握卧推/夹胸
  ["BV1NW4y1Y7xw"]="dumbbell-30.mp4"      # 卓叔30个哑铃动作（划船/弯举/深蹲/弓步/硬拉）
  ["BV1YE411K7vF"]="shoulder-press.mp4"   # 哑铃站姿推举
  ["BV1cx411j7A1"]="leg-raise.mp4"        # 腹部踢腿
)

for bv in "${!videos[@]}"; do
  filename="${videos[$bv]}"
  echo "📥 下载: $bv -> $filename"
  
  if [ -f "$filename" ]; then
    echo "  ✅ 已存在，跳过"
    continue
  fi
  
  yt-dlp \
    -f "30032+30280/30016+30280/best[ext=mp4]/best" \
    --merge-output-format mp4 \
    -o "$filename" \
    "https://www.bilibili.com/video/$bv" || echo "  ❌ 下载失败: $bv"
done

echo ""
echo "✅ 下载完成！"
ls -lh "$VIDEOS_DIR"/*.mp4 2>/dev/null || echo "没有下载成功的视频"
