import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type MagicLinkEmailProps = {
  magicLinkUrl: string;
  emailAddress: string;
};

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

export const MagicLinkEmail = ({
  magicLinkUrl = "https://western-rank-fe-git-dev-western-rank.vercel.app/",
  emailAddress = "westernrank@uwo.ca",
}: MagicLinkEmailProps) => {
  const username = emailAddress.split("@")[0];

  return (
    <Html>
      <Head />
      <Preview>{username}, Sign in to Western Rank</Preview>
      <Tailwind>
        <Body
          className="bg-white my-auto mx-auto"
          style={{
            fontFamily:
              'BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
          }}
        >
          <Container
            className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto px-[40px] py-[70px]"
            style={{ maxWidth: "500px" }}
          >
            <Section className="py-0 h-0 mb-[20px]">
              <Img src={`${baseUrl}/logo.png`} width="40" alt="Western Rank" className="my-0" />
              <Heading className="text-black text-[30px] font-bold p-0 mx-0 my-0">
                Sign in to <span className="text-purple-600">Western Rank</span>
              </Heading>
            </Section>
            <Text className="text-black text-[14px] h-[10px] leading-[20px] mb-[20px]">
              Hi <strong>{username}</strong>!
            </Text>
            <Text className="text-black text-[14px] leading-[20px]">
              Welcome (back) to Western Rank! Click here to start reviewing your courses.
            </Text>
            <Button
              pX={20}
              pY={12}
              className="bg-purple-600 rounded text-white text-[12px] font-semibold no-underline text-center"
              href={magicLinkUrl}
            >
              Sign in
            </Button>
            <Text className="text-black text-[14px] h-[7px]">
              or copy and paste this URL into your browser:
            </Text>
            <Link className="text-[14px]" href={magicLinkUrl}>
              {magicLinkUrl}
            </Link>
            <Hr className="border border-solid border-[#eaeaea] my-[20px] mt-[50px] mx-0 w-full" />
            <Link className="text-[14px]" href={baseUrl}>
              Western Rank
            </Link>
            <Text className="text-[#666666] text-[12px] leading-[20px]">
              This magic link was intended for <span className="text-black">{username}.</span> This
              invite was sent from located in. If you were not expecting this invitation, you can
              ignore this email. If you are concerned about your account&apos;s safety, please reply
              to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkEmail;
