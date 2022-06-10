# [choiXe](https://www.choixe.app) Backend &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/choiXe/choiXe/blob/main/LICENSE)

> AWS Lambda Service that processes the data for choiXe

## License & Copyright Notice

This repository has been created as a part of the ongoing development of the [choiXe](https://github.com/Eppey/choixe-webapp) project.

The work in this repository is licensed under the [MIT](https://github.com/Eppey/choixe-main/blob/main/LICENSE) license.

Copyright (c) 2022 choiXe team

## Running Locally

### Prerequisites

- Install [Git](https://git-scm.com/)
- Install [aws-cli](https://github.com/aws/aws-cli)
- choiXe [AWS IAM User Credentials](https://aws.amazon.com/iam/)

### Getting started

#### Configure AWS profile with choiXe IAM User Credentials

```
$ aws configure
AWS Access Key ID [None]: YOUR ACCESS KEY
AWS Secret Access Key [None]: YOUR SECRET ACCESS KEY
Default region name [None]: ap-northeast-2
Default output format [None]: json
```

#### Clone the repository

```
$ git clone https://github.com/Eppey/choixe-main.git
```

#### Install dependencies

```
$ cd backend
$ npm ci
```

#### Build and run the project

Run following command in terminal.

```
$ cd choixe-main/src/
$ ts-node FILE_NAME_TO_TEST
```

## Running in AWS Lambda

### Prerequisites

- choiXe [AWS IAM User Credentials](https://aws.amazon.com/iam/)

### Getting started

#### Copy required files to a folder

Create a new folder called **lambdaFunction**.<br>
Copy *node_modules* folder, all files under *backend/src/*, and *package.json* to **lambdaFunction**.

#### Create a .zip file archive

```
$ zip -r lambdaFunction.zip .
```

#### Create AWS Lambda function

Create a new lambda function from AWS console with DynamoDB Query permission.<br>
Upload by clicking **Upload from > .zip file**.

#### Create test event

Will be updated

#### Deploy and run the project

Click deploy from AWS Lambda console prior to testing and run Test.

---
