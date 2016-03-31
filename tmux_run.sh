#!/bin/bash

# var for session name (to avoid repeated occurences)
sn=xyz

tmux new-session -s "$sn" -n etc -d "npm run be"
# tmux set-option set-remain-on-exit on

tmux split-window -v "npm run babelb"
tmux split-window -h "npm run wp"

# Set the default cwd for new windows (optional, otherwise defaults to session cwd)
#tmux set-option default-path /

# Select window #1 and attach to the session
tmux select-window -t "$sn:1"
tmux -2 attach-session -t "$sn"