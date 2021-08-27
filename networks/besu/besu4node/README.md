# docker-composeファイルの種類

## ファイル一覧

|ファイル名|用途|
|----|----|
|docker-compose.yml|基本的な動作用, IBFT|
|docker-compose-onchain.yml|BCNWへ参加することをスマートコントラクトで制御する, IBFT|
|docker-compose-onChainPrivacy.yml|FlexiblePrivacyGroup用, IBFT|

## 起動停止方法

### FlexiblePrivacyGroup用プライベートネットワーク（IBFT）(docker-compose-onChainPrivacy.yml)

他のdocker-composeファイルも基本同じはず

#### 起動

```bash
docker-compose -f docker-compose-onChainPrivacy.yml up -d
```

#### 停止

```bash
docker-compose -f docker-compose-onChainPrivacy.yml down
```

