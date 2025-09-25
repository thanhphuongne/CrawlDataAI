# Node.js バージョン20のイメージを使用
FROM node:18

# 必要なツールをインストール
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    r-base \
    locales \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

RUN echo "ja_JP.UTF-8 UTF-8" > /etc/locale.gen && \
locale-gen ja_JP.UTF-8 && \
update-locale LANG=ja_JP.UTF-8

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

# 作業ディレクトリを設定
WORKDIR /app

# 仮想環境の作成とアクティブ化
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# Node.jsの依存関係をインストールするためにpackage.jsonとyarn.lockをコピー
COPY package.json yarn.lock ./

RUN yarn install

# プロジェクト全体をコンテナにコピー
COPY . .

COPY dss-new.sqlite ./dss-new.sqlite

# requirements.txtからPythonパッケージをインストール
RUN pip3 install -r scripts/requirements.txt

# 必要なRパッケージをインストール
RUN Rscript -e "install.packages(c('openxlsx', 'dplyr', 'jsonlite', 'plotly', 'htmlwidgets'), repos='https://cran.rstudio.com/')"

# uploadsディレクトリを作成
RUN mkdir -p /app/uploads

# .envが存在しない場合、.env.exampleから.envファイルを作成
RUN cp .env.example .env

# コンテナ起動時にコマンドを実行
CMD ["yarn", "dev"]
