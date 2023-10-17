tmux new-session -s microservices 'cd auth && npm run start:dev' \; \
 split-window -h 'cd user && npm run start:dev' \; \
 split-window -h 'cd mailer && npm run start:dev' \; \
 split-window -h 'cd event && npm run start:dev' \; \
 set-window-option mode-keys vi \; \
 select-layout even-horizontal
