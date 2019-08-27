image: node:latest

services:
#  - mysql:latest
#  - redis:latest
#  - postgres:latest

# http://docs.gitlab.com/ce/ci/yaml/README.html#cache

stages:
- init_restart
#- deploy_v5
#- deploy_production

# 1.需要自行配置 gitlab runner
# 2.ssh免登录
# 3.gitlab中设置好 SSH_PRIVATE_KEY

cache:
  paths:
  - node_modules/
before_script:

job_init_restart:
  stage: init_restart
  only:
  - develop
  script:
  - 'ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime'
  - 'echo "当前时间:`date`"'
  - 'which ssh-agent || ( yum update -y && yum install openssh-client -y )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\tPort 1876\n\n" > ~/.ssh/config'
  - 'ssh www@172.16.0.46 -p 1876 "cd /home/www/data_board && git pull && exit"'
  # 安装npm模块，万一有新的呢
  - 'ssh www@172.16.0.46 -p 1876 "cd /home/www/data_board && yarn install && exit"'
  # 重启项目
  - 'ssh www@172.16.0.46 -p 1876 "cd /home/www/data_board && npm run test"'
