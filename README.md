# uPortlandia

uPortlandia is our vision of the future of data and identity management.  We hope that the examples contained within this repository will serve as a guide for your adoption of sovereign identity solution(s).

![uportlandia](https://j.gifs.com/wVrrvr.gif)

What's inside:

- [x] Serverless artifacts created:
  - [x] KMS key for SSM
  - [x] S3 Bucket for static site deployment
  - [x] API gateway lambda function to securely sign claims
- [x] Setup task:
  - [x] Creates Issuer (application) Identities
  - [x] Stores the generated Identity key/pairs in SSM 

## References

[NCTU Domain Hosting](https://nctu.me/)
build-a-web-app [無伺服器 Web 應用程式](https://aws.amazon.com/tw/serverless/build-a-web-app/)

### Requirements

- NodeJS 10+
- [Yarn](https://yarnpkg.com) ( `curl -o- -L https://yarnpkg.com/install.sh | bash` )
- Serverless Framework (`npm install serverless -g`)
- AWS (managed by serverless)

### Initial Setup

**Step 1**

Change [setup_config.js](./setup_config.js) to suit your requirements

**Step 2**

Save your AWS credentials in `~/.aws/credentials` under the `[default]` profile.
`C:\Users\jacob.hsu\.aws\credentials`  

**Step 3**

```s
$ yarn setup --env stage
```

The setup script
- registers Issuer Entities
- saves private keys and DIDs to SSM parameter store
- deploys the signer lambdas
- builds the static bundle and uploads to an S3 bucket

---
$ node node_scripts/setup --env stage
Before you proceed:

    - save valid AWS credentials in ~/.aws/credentials. The [default] profile will be used for the 
setup.
    - change setup_config.js to suit your application

 [Ctrl-C] to cancel; To continue with the setup, press [Enter]
---

Do you want to use an [E]xisting key of create a [n]ew one?

- saves private keys
Key Management Service (KMS)  
安全性、身分與合規 > [Key Management Service](https://console.aws.amazon.com/kms)
AWS 受管金鑰 / 客戶受管金鑰 全列出

Creating a new KMS key...

客戶受管金鑰 會新增一筆 狀態[已啟用]

- saves  DIDs to SSM parameter store
[Ctrl-C] to cancel. To save this to SSM, press [Enter]

[AWS Systems Manager](https://docs.aws.amazon.com/zh_cn/systems-manager/latest/userguide/systems-manager-quick-setup.html)
管理與管控 > [Systems Manager](https://console.aws.amazon.com/systems-manager/)

利用 Parameter Store (`Aws > 管理與管控 > Systems Manager > 參數存放區`) 來儲存 credentials 和 config 等機敏性參數  (`put-parameter`、`get-parameters`)

名稱 /uportlandia/stage/issuers | 方案 Standard  | 類型 SecureString

```json
{
  "MUSEUM": {
    "did": "did:ethr:0xebde2b053de2ef895c95503cbbf7057f06bfeb29",
    "key": "644ea356491b24d820882878d2bcc127c98deed45de4b136d2e4cb3013f696b0",
    "vc": [
      "/ipfs/QmQykuZBrZaYWhGbQef8p9oxkFjP6VLeooXkZZvpiDUDwz"
    ]
  },
  "TRANSPORT": {
    "did": "did:ethr:0xecde45730261fdeca15f7d1065cf772d43bf5be1",
    "key": "5ad1e0e8c8fd2801ded4d2a568fb4171abd457ae1cdfe8b1623fad2b973f442d",
    "vc": [
      "/ipfs/QmfEGMofohy2gA6sCVHbW1epjjfWizXoTg2YazoPkoomPn"
    ]
  },
  "PHARMACY": {
    "did": "did:ethr:0x23f66c121db67bfb11496e09783bb92553ccab21",
    "key": "b807473d3c02dba94557de34bdbac4948d9163d636485ab3e98ff857286671f4",
    "vc": [
      "/ipfs/QmXHYpw2dHMWyC7aUPRhFr6A6okNse9AtAn8M5QxoyVf2F"
    ]
  },
  "INSURANCE": {
    "did": "did:ethr:0xfa2da0e5c4c2eca8824e60872248e85973e8d1ea",
    "key": "6d2643f4817bf76e12646e8beabd2aafeceac13954e991326ce906e9fee07cd0",
    "vc": [
      "/ipfs/QmeCrT6Ahc735gNRv1fmVQhGjNuB386KMA14LsjVhQoNfU"
    ]
  },
  "COMPANY": {
    "did": "did:ethr:0x15b0a62064d1740b7644e60880f8c43066c36cb9",
    "key": "6cf11a2aa603c00ca891877db070e6de2a0bfc3594e72d191d87de65515970ec",
    "vc": [
      "/ipfs/QmXdMwKMsWCadJrrWDmAz5zDpNMBYw6m3DhQW68fEGpmfY"
    ]
  },
  "DIPLOMA": {
    "did": "did:ethr:0x1afafaa6b059e56331ad4597239e56aedb35cb75",
    "key": "115773de90883b6d9df42eeb297d2d31badd3413b6d87d05304f228ac7bf1279",
    "vc": [
      "/ipfs/QmTq6cXRpyTcBULEiFnyMgH6MrnHH5r4UQiiyE9fCb1M3s"
    ]
  },
  "CITY_ID": {
    "did": "did:ethr:0x8bb183661b5a34de9b9335121cd6d52dda36891d",
    "key": "e7c670843c016850d4ae3f20276e73755a6c91a2f6046abcef55f0fe42a3533e",
    "vc": [
      "/ipfs/QmXLhSxiQt89kY9mnWUPAZYna1a51jmqLVPf6iN4TGdJK1"
    ]
  }
}
```
---

- deploys the signer lambdas

$ ./node_modules/.bin/sls
生成  node_scripts 
.gitignore serverless.yml handler.js

`serverless.js` 對應 `serverless.yml

'.' 不是內部或外部命令、可執行的程式或批次檔。

node_scripts\deploy_api.js

windows環境設成全域執行

```js
async function deployAPI() {
  const args = argParse();
  // await run("./node_modules/.bin/sls", [ "deploy", "-v", "-s", args.env ]);
  // npm install serverless -g
  await run("sls", [ "deploy", "-v", "-s", args.env ]);
}
```
---

[新增儲存貯體政策以允許公有讀取](https://aws.amazon.com/tw/getting-started/projects/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/module-1/)

選擇 `Permissions (許可)` 索引標籤，然後選擇 `Bucket Policy (儲存貯體政策)`
將下列政策文件輸入至儲存貯體政策編輯器，同時將 `[YOUR_BUCKET_NAME]` 取代為您已在區段 1 建立的儲存貯體名稱：

```js
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow", 
            "Principal": "*", 
            "Action": "s3:GetObject", 
            "Resource": "arn:aws:s3:::[YOUR_BUCKET_NAME]/*" 
        } 
    ] 
}
```

Amazon S3/uport-stage 屬性/靜態網站託管

http://uport-stage.s3-website.us-east-1.amazonaws.com/

聯網與內容交付 Route 53
聯網與內容交付 CloudFront 備用網域名稱(CNAME)

Error: Distribution matching cname "jacobhsu.nctu.me" was not found.

You are all set! To build and deploy the static site run

**Step 4:**

Repeat the process for `--env prod`.


### Running Locally

**Lambdas**

Start Serverless Offline:
```
yarn local:api
```

**Front End**

In a separate terminal window, run
```
yarn start
```
Open http://localhost:3000/


### Deploying Changes

**Lambdas**
```
yarn deploy:api --env stage
```

**Front End**
```
yarn deploy:static  --env stage
```

**Note:** `--env` must be `stage` or `prod`.


## Whitelabel Config

1. Change the [Whitelabel Config](src/constants/config.js)
1. Customize the Static Text: [English](src/constants/i18-en.js) and [Spanish](src/constants/i18-es.js)
1. Change the [Color Palette](src/components/shared/theme.js)


[FAQ and helpdesk support](http://bit.ly/uPort_helpdesk)
