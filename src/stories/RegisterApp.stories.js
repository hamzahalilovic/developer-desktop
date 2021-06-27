/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { useRef, useState, useEffect } from "react";

import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";
import config from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import { getPrifinaUserQuery } from "../graphql/api";

import { default as DefaultApp } from "../pages/Home";
import { useFormFields } from "../lib/formFields";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  useTheme,
  ThemeProvider,
} from "@blend-ui/core";

import CreateProjectModal from "../components/CreateProjectModal";
import createProject from "../assets/createProject.png";
import docs from "../assets/docs.png";
import starterResources from "../assets/starterResources.png";
import launcherResources from "../assets/launcherResources.png";
import slackResources from "../assets/slackResources.png";
import table from "../assets/table.png";

const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

const AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};

const S3Config = {
  AWSS3: {
    bucket: config.S3.bucket, //REQUIRED -  Amazon S3 bucket name
    region: config.S3.region, //OPTIONAL -  Amazon service region
  },
};

export default { title: "Register App" };

export const RegisterApp = props => {
  console.log("COMPONENT ---> ", props);
  console.log("CONFIG ", config);
  const [settingsReady, setSettingsReady] = useState(false);
  const clientHandler = useRef(null);

  const prifinaID = useRef("");
  const [login, setLogin] = useState(true);

  const [loginFields, handleChange] = useFormFields({
    username: "",
    password: "",
  });

  //   Auth.configure(AUTHConfig);
  //   Amplify.configure(APIConfig);
  //   Amplify.configure(S3Config);
  console.log("AUTH CONFIG ", AUTHConfig);

  const createClient = (endpoint, region) => {
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        // credentials: () => Auth.currentCredentials(),
      },
      /*
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () =>
        (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    */
      disableOffline: true,
    });
    return client;
  };

  // get user auth...
  useEffect(async () => {
    try {
      if (login) {
        const session = await Auth.currentSession();

        console.log("SESSION ", session);
        if (!session) {
          console.log("NO CURRENT SESSION FOUND");
        }
        console.log("PRIFINA-ID", session.idToken.payload["custom:prifina"]);
        prifinaID.current = session.idToken.payload["custom:prifina"];

        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          prifinaID.current,
        );

        console.log("CURRENT USER ", currentPrifinaUser);

        const appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        let clientEndpoint =
          "https://kxsr2w4zxbb5vi5p7nbeyfzuee.appsync-api.us-east-1.amazonaws.com/graphql";
        let clientRegion = "us-east-1";
        if (appProfile.hasOwnProperty("endpoint")) {
          clientEndpoint = appProfile.endpoint;
          clientRegion = appProfile.region;
        }

        clientHandler.current = createClient(clientEndpoint, clientRegion);

        setSettingsReady(true);
      }
    } catch (e) {
      if (typeof e === "string" && e === "No current user") {
        setLogin(false);
        //const user = await Auth.signIn("tahola", "xxxx");
        //console.log("AUTH ", user);
        //console.log("APP DEBUG ", appCode);
      }

      console.log("AUTH ", e);
    }
  }, [login]);

  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(true);
  const [step, setStep] = useState(0);

  switch (step) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    default:
  }

  const onCloseCheck = (e, action) => {
    console.log("MODAL CLOSE ", e, action);
    onClose(e, action);
    e.preventDefault();
  };

  const Navbar = () => {
    return (
      <Flex
        height="74px"
        bg="#08011C"
        style={{ position: "sticky", top: 0, zIndex: 1 }}
      ></Flex>
    );
  };
  const UserMenu = () => {
    return (
      <Flex
        height="100%"
        flexDirection="column"
        width="288px"
        position="fixed"
        bg="#08011C"
        zIndex={1}
        alignItems="center"
        paddingTop={25}
      />
    );
  };

  const ResourceCard = ({ title, description, src }) => {
    return (
      <Flex
        width="238px"
        height="120px"
        bg="#08011C"
        borderRadius="5px"
        alignItems="center"
      >
        <Image
          src={src}
          height="65px"
          width="55px"
          marginLeft="-12px"
          position="absolute"
        />
        <Box paddingLeft="26px">
          <Text color="white" fontSize={16} paddingBottom="5px">
            {title}
          </Text>
          <Text color="#ADADAD" fontSize={12}>
            {description}
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <ThemeProvider>
      {/* {!login && (
        <div>
          <div>
            Username:
            <input id={"username"} name={"username"} onChange={handleChange} />
          </div>
          <div>
            Password:
            <input id={"password"} name={"password"} onChange={handleChange} />
          </div>
          <div>
            <button
              onClick={e => {
                //console.log(loginFields);
                Auth.signIn(loginFields.username, loginFields.password).then(
                  () => {
                    setLogin(true);
                  },
                );
              }}
            >
              Login
            </button>
          </div>
        </div>
      )} */}
      {/* {login && settingsReady && (
        <DefaultApp
          appSyncClient={clientHandler.current}
          prifinaID={prifinaID.current}
          GraphQLClient={GRAPHQL}
        />
      )}
      {!settingsReady && <div />} */}

      <Navbar />
      <UserMenu />
      {step === 0 && (
        <Flex
          width="100%"
          height="718px"
          paddingLeft="288px"
          paddingTop="30px"
          bg="#141020"
          // justifyContent="center"
          flexDirection="column"
        >
          <Flex flexDirection="column" alignItems="center">
            <Image src={createProject} style={{ position: "relative" }} />
            <Flex
              textAlign="center"
              width="506px"
              height="196px"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
              position="absolute"
              top="243px"
            >
              <Text color="white" fontSize={24}>
                Create your first project
              </Text>
              <Text color="#969595" fontSize={20}>
                Working on an app or are already done making one? Make it
                official by adding it here.
              </Text>
              <Button
                onClick={() => {
                  setStep(1);
                }}
              >
                New Project
              </Button>
            </Flex>
          </Flex>
          <Box paddingLeft="62px" paddingTop="100px">
            <Text color="white" fontSize={24}>
              Key Resources
            </Text>
            <Text color="#F5F8F7" fontSize={16} paddingTop="8px">
              Resources and utilities to help you build for Prifina
            </Text>
            <Flex paddingTop="35px">
              <Box paddingRight="12px">
                <ResourceCard
                  src={docs}
                  title="Prifina Docs"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                />
              </Box>
              <Box paddingRight="12px">
                <ResourceCard
                  src={starterResources}
                  title="Prifina Docs"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                />
              </Box>
              <Box paddingRight="12px">
                <ResourceCard
                  src={launcherResources}
                  title="Prifina Docs"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                />
              </Box>
              <Box>
                <ResourceCard
                  src={slackResources}
                  title="Prifina Docs"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
                />
              </Box>
            </Flex>
          </Box>
        </Flex>
      )}
      {step === 1 && (
        <Flex
          width="100%"
          height="718px"
          paddingLeft="288px"
          paddingTop="48px"
          bg="#141020"
          // justifyContent="center"
          flexDirection="column"
        >
          <CreateProjectModal />

          <Flex
            marginLeft="66px"
            bg="#231D35"
            width="1007px"
            height="617px"
            borderRadius="10px"
            flexDirection="column"
            alignItems="center"
          >
            <Flex
              paddingLeft="16px"
              paddingTop="16px"
              paddingBottom="40px"
              justifyContent="space-between"
              display="flex"
            >
              <Text color="white" fontSize={24}>
                Projects
              </Text>
              <Box marginLeft="750px">
                <Button
                  onClick={() => {
                    setStep(2);
                  }}
                >
                  New Project
                </Button>
              </Box>
            </Flex>
            <Image src={table} width="975px" height="433px" />
          </Flex>
        </Flex>
      )}
      {step === 2 && (
        <Flex
          width="100%"
          height="718px"
          paddingLeft="288px"
          paddingTop="48px"
          bg="#141020"
          // justifyContent="center"
          flexDirection="column"
        >
          <Flex
            marginLeft="66px"
            bg="#231D35"
            width="1007px"
            height="64px"
            borderRadius="10px"
            flexDirection="column"
            alignItems="center"
          >
            <Flex
              paddingLeft="16px"
              paddingTop="16px"
              paddingBottom="40px"
              justifyContent="space-between"
              display="flex"
            >
              <Flex>
                <Text color="white" fontSize={24}>
                  App
                </Text>
              </Flex>
              <Box marginLeft="750px">
                <Button>Launch Sandbox</Button>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      )}
    </ThemeProvider>
  );
};

RegisterApp.story = {
  name: "Default App",
};

RegisterApp.story = {
  name: "Default APP theme",

  decorators: [
    Story => {
      //console.log("PROVIDER ", PrifinaProvider);
      return (
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};