import React, { useState } from "react";
import { Menu } from "antd";
import {
  SafetyOutlined,
  MessageOutlined,
  BulbOutlined,
  WarningOutlined,
  GlobalOutlined,
  SmileFilled,
  HeartOutlined,
  SoundFilled
} from "@ant-design/icons";

// export default function Rule({ setRule }) {
//   const [current, setCurrent] = useState("1");

//   const onClick = (e) => {
//     setCurrent(e.key);
//   };

//   return (
   
//       <>
//         <p className="rule-title">{setRule.slice(0, 1).toUpperCase() + setRule.slice(1)} Rule</p>
//           <Menu
//             onClick={onClick}
//             style={{ width: "100%" }}
//             defaultOpenKeys={["sub2"]}
//             selectedKeys={[current]}
//             mode="inline"
//             items={setRule === "content" ? contentItems : setRule === "confession" ? confessionItems : questionItems}
//           />
//           <div className='rule-agree-div'>
//               <p className="rule-agree"><SoundFilled /> By posting, you agree to help keep the platform safe, useful, and enjoyable for everyone. Happy Posting </p>
//           </div>
   
//       </>

    
 
//   );
// }

export default function Rule({ setRule }) {
  const [current, setCurrent] = useState("1");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const getItems = () => {
    switch(setRule) {
      case "content":
        return contentItems;
      case "confession":
        return confessionItems;
      case "question":
        return questionItems;
      case "question-comment":
        return questionCommentItems;
      case "content-comment":
        return contentCommentItems;
      case "confession-comment":
        return confessionCommentItems;
      default:
        return questionItems;
    }
  };

  return (
    <>
      <p className="rule-title">{setRule.slice(0, 1).toUpperCase() + setRule.slice(1)} Rule</p>
      <Menu
        onClick={onClick}
        style={{ width: "100%" }}
        defaultOpenKeys={["sub2"]}
        selectedKeys={[current]}
        mode="inline"
        items={getItems()}
      />
      {
        setRule !== 'question-comment' && setRule !== 'content-comment' && setRule !== 'confession-comment' &&
        <div className='rule-agree-div'>
        <p className="rule-agree"><SoundFilled /> By posting, you agree to help keep the platform safe, useful, and enjoyable for everyone. Happy Posting</p>
      </div>
      }
      
    </>
  );
}

const textStyle = {
  whiteSpace: "normal",
  wordBreak: "break-word",
  lineHeight: "1.6",
};

const questionItems = [
  {
    key: "sub1",
    label: "Respect Others",
    icon: <HeartOutlined />,
    children: [
      {
        key: "1",
        label: (
          <span style={textStyle}>
            Treat other users with basic respect, even when you disagree with
            them.
          </span>
        ),
        disabled: true,
      },
      {
        key: "2",
        label: (
          <span style={textStyle}>
            Do not post harassment, hate speech, bullying, threats, or personal
            attacks toward individuals or groups.
          </span>
        ),
        disabled: true,
      },
      {
        key: "3",
        label: (
          <span style={textStyle}>
            Healthy debates are welcome. Toxic behavior and intentionally hostile
            discussions are not.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub2",
    label: "Ask Clear & Helpful Questions",
    icon: <MessageOutlined />,
    children: [
      {
        key: "4",
        label: (
          <span style={textStyle}>
            Use a clear title that explains your question instead of vague titles
            like “Help” or “Urgent”.
          </span>
        ),
        disabled: true,
      },
      {
        key: "5",
        label: (
          <span style={textStyle}>
            Include enough context so others can understand your situation and
            provide meaningful answers.
          </span>
        ),
        disabled: true,
      },
      {
        key: "6",
        label: (
          <span style={textStyle}>
            Keep posts relevant to the selected topic or category.
          </span>
        ),
        disabled: true,
      },
      {
        key: "7",
        label: (
          <span style={textStyle}>
            Low-effort, misleading, or spam-style posts may be removed to keep
            discussions useful.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub3",
    label: "Share Honest Information",
    icon: <BulbOutlined />,
    children: [
      {
        key: "8",
        label: (
          <span style={textStyle}>
            Do not intentionally spread false information, fake stories, scams,
            or manipulated content.
          </span>
        ),
        disabled: true,
      },
      {
        key: "9",
        label: (
          <span style={textStyle}>
            If you are unsure about something, ask questions openly instead of
            presenting assumptions as facts.
          </span>
        ),
        disabled: true,
      },
      {
        key: "10",
        label: (
          <span style={textStyle}>
            When discussing serious topics, providing sources or evidence is
            encouraged.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub4",
    label: "Protect Privacy & Safety",
    icon: <SafetyOutlined />,
    children: [
      {
        key: "11",
        label: (
          <span style={textStyle}>
            Do not share personal, private, or confidential information about
            yourself or other people.
          </span>
        ),
        disabled: true,
      },
      {
        key: "12",
        label: (
          <span style={textStyle}>
            Avoid posting content that promotes illegal, dangerous, or harmful
            activities.
          </span>
        ),
        disabled: true,
      },
      {
        key: "13",
        label: (
          <span style={textStyle}>
            Report abusive or suspicious content instead of engaging with it.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub5",
    label: "Keep the Community Useful",
    icon: <GlobalOutlined />,
    children: [
      {
        key: "14",
        label: (
          <span style={textStyle}>
            Avoid excessive self-promotion, repetitive posting, or unrelated
            advertising.
          </span>
        ),
        disabled: true,
      },
      {
        key: "15",
        label: (
          <span style={textStyle}>
            Contribute in a way that helps others learn, discuss, or solve
            problems together.
          </span>
        ),
        disabled: true,
      },
      {
        key: "16",
        label: (
          <span style={textStyle}>
            Content that seriously violates these guidelines may be removed to
            maintain a safe and high-quality experience.
          </span>
        ),
        disabled: true,
      },
    ],
  },
];

const confessionItems = [
  {
    key: "sub1",
    label: "Stay Respectful",
    icon: <HeartOutlined />,
    children: [
      {
        key: "1",
        label: (
          <span style={textStyle}>
            Confessions should not be used to attack, shame, humiliate, or harass other people.
          </span>
        ),
        disabled: true,
      },
      {
        key: "2",
        label: (
          <span style={textStyle}>
            Hate speech, bullying, threats, and abusive language are not allowed.
          </span>
        ),
        disabled: true,
      },
      {
        key: "3",
        label: (
          <span style={textStyle}>
            Strong emotions are okay. Targeted hostility and toxic behavior are not.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub2",
    label: "Protect Privacy",
    icon: <SafetyOutlined />,
    children: [
      {
        key: "4",
        label: (
          <span style={textStyle}>
            Do not share personal information such as full names, phone numbers, addresses, school details, or private photos.
          </span>
        ),
        disabled: true,
      },
      {
        key: "5",
        label: (
          <span style={textStyle}>
            Avoid exposing or identifying other people without their permission.
          </span>
        ),
        disabled: true,
      },
      {
        key: "6",
        label: (
          <span style={textStyle}>
            Anonymous posting is meant for honest expression, not revenge or public targeting.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub3",
    label: "Keep It Genuine",
    icon: <BulbOutlined />,
    children: [
      {
        key: "7",
        label: (
          <span style={textStyle}>
            Share real thoughts, experiences, or feelings instead of fake stories made to provoke reactions.
          </span>
        ),
        disabled: true,
      },
      {
        key: "8",
        label: (
          <span style={textStyle}>
            Avoid spam, trolling, repetitive posting, or intentionally misleading content.
          </span>
        ),
        disabled: true,
      },
      {
        key: "9",
        label: (
          <span style={textStyle}>
            Sensitive topics are allowed, but posts that encourage harm, violence, or dangerous behavior may be removed.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub4",
    label: "Keep the Space Safe",
    icon: <GlobalOutlined />,
    children: [
      {
        key: "10",
        label: (
          <span style={textStyle}>
            This space is for open expression, support, and discussion — not personal attacks or conflict escalation.
          </span>
        ),
        disabled: true,
      },
      {
        key: "11",
        label: (
          <span style={textStyle}>
            Content involving illegal activity, exploitation, or harmful behavior may be removed for community safety.
          </span>
        ),
        disabled: true,
      },
      {
        key: "12",
        label: (
          <span style={textStyle}>
            Repeated or serious violations may result in content removal or account restrictions.
          </span>
        ),
        disabled: true,
      },
    ],
  },
];

const contentItems = [
  {
    key: "sub1",
    label: "Create Meaningful Content",
    icon: <BulbOutlined />,
    children: [
      {
        key: "1",
        label: (
          <span style={textStyle}>
            Share content that is helpful, creative, informative, entertaining,
            or meaningful to others.
          </span>
        ),
        disabled: true,
      },
      {
        key: "2",
        label: (
          <span style={textStyle}>
            Avoid low-effort spam, repetitive posting, or misleading content
            created only to gain attention.
          </span>
        ),
        disabled: true,
      },
      {
        key: "3",
        label: (
          <span style={textStyle}>
            Use clear titles, captions, or descriptions so people can understand
            your content quickly.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub2",
    label: "Respect the Community",
    icon: <SafetyOutlined />,
    children: [
      {
        key: "4",
        label: (
          <span style={textStyle}>
            Do not post hate speech, harassment, bullying, or intentionally
            harmful content toward others.
          </span>
        ),
        disabled: true,
      },
      {
        key: "5",
        label: (
          <span style={textStyle}>
            Discussions and criticism are welcome, but personal attacks and toxic
            behavior are not.
          </span>
        ),
        disabled: true,
      },
      {
        key: "6",
        label: (
          <span style={textStyle}>
            Respect different opinions, backgrounds, and perspectives within the
            community.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub3",
    label: "Share Honest & Original Content",
    icon: <MessageOutlined />,
    children: [
      {
        key: "7",
        label: (
          <span style={textStyle}>
            Do not intentionally spread false information, scams, impersonation,
            or manipulated content designed to deceive people.
          </span>
        ),
        disabled: true,
      },
      {
        key: "8",
        label: (
          <span style={textStyle}>
            Give proper credit when sharing someone else’s work, ideas, or media.
          </span>
        ),
        disabled: true,
      },
      {
        key: "9",
        label: (
          <span style={textStyle}>
            Avoid reposting the same content repeatedly across the platform.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub4",
    label: "Protect Privacy & Safety",
    icon: <WarningOutlined />,
    children: [
      {
        key: "10",
        label: (
          <span style={textStyle}>
            Do not share private, personal, or confidential information about
            yourself or others.
          </span>
        ),
        disabled: true,
      },
      {
        key: "11",
        label: (
          <span style={textStyle}>
            Content promoting illegal, dangerous, exploitative, or harmful
            activities may be removed.
          </span>
        ),
        disabled: true,
      },
      {
        key: "12",
        label: (
          <span style={textStyle}>
            Report suspicious or abusive content to help keep the community safe.
          </span>
        ),
        disabled: true,
      },
    ],
  },

  {
    key: "sub5",
    label: "Help Build a Better Platform",
    icon: <GlobalOutlined />,
    children: [
      {
        key: "13",
        label: (
          <span style={textStyle}>
            Encourage thoughtful discussions, creativity, learning, and positive
            interactions within the community.
          </span>
        ),
        disabled: true,
      },
      {
        key: "14",
        label: (
          <span style={textStyle}>
            Excessive advertising, engagement bait, or manipulative posting may
            be limited or removed.
          </span>
        ),
        disabled: true,
      },
      {
        key: "15",
        label: (
          <span style={textStyle}>
            Content that seriously violates community guidelines may be removed
            to maintain a high-quality experience for everyone.
          </span>
        ),
        disabled: true,
      },
    ],
  },
];


const questionCommentItems = [
  {
    key: "sub1",
    label: "Be Helpful & Relevant",
    icon: <MessageOutlined />,
    children: [
      {
        key: "1",
        label: (
          <span style={textStyle}>
            Provide clear, direct answers that address the question. Stay on topic and avoid off-topic responses.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub2",
    label: "Explain Your Reasoning",
    icon: <BulbOutlined />,
    children: [
      {
        key: "2",
        label: (
          <span style={textStyle}>
            Include explanations, steps, or sources to support your answer. Avoid one-word or low-effort responses.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub3",
    label: "Respectful Discussion",
    icon: <HeartOutlined />,
    children: [
      {
        key: "3",
        label: (
          <span style={textStyle}>
            Disagree constructively by explaining your viewpoint. Don't attack the person or use dismissive language.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub4",
    label: "Keep It Clean",
    icon: <SafetyOutlined />,
    children: [
      {
        key: "4",
        label: (
          <span style={textStyle}>
            No spam, promotional links, or self-promotion unless relevant. Report helpful answers and flag harmful comments.
          </span>
        ),
        disabled: true,
      },
    ],
  },
];

const contentCommentItems = [
  {
    key: "sub1",
    label: "Engage Meaningfully",
    icon: <MessageOutlined />,
    children: [
      {
        key: "1",
        label: (
          <span style={textStyle}>
            Share thoughtful reactions or questions about the content. Avoid generic comments like "Nice" or "Cool."
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub2",
    label: "Constructive Feedback",
    icon: <BulbOutlined />,
    children: [
      {
        key: "2",
        label: (
          <span style={textStyle}>
            Explain why you dislike something and suggest improvements. Balance criticism by acknowledging what works well.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub3",
    label: "Respect the Creator",
    icon: <HeartOutlined />,
    children: [
      {
        key: "3",
        label: (
          <span style={textStyle}>
            No harassment, personal attacks, or disrespectful comments. Encourage creators by highlighting what you appreciate.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub4",
    label: "Stay Safe & Appropriate",
    icon: <SafetyOutlined />,
    children: [
      {
        key: "4",
        label: (
          <span style={textStyle}>
            No spam, self-promotion, or irrelevant links. Flag inappropriate content to keep the community safe.
          </span>
        ),
        disabled: true,
      },
    ],
  },
];

const confessionCommentItems = [
  {
    key: "sub1",
    label: "Respond with Empathy",
    icon: <HeartOutlined />,
    children: [
      {
        key: "1",
        label: (
          <span style={textStyle}>
            Respond with kindness, understanding, and support. Avoid judgmental, dismissive, or harsh language.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub2",
    label: "Share Thoughtful Perspectives",
    icon: <BulbOutlined />,
    children: [
      {
        key: "2",
        label: (
          <span style={textStyle}>
            Offer different viewpoints respectfully. Don't give unsolicited advice unless the confessor asks.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub3",
    label: "Protect Anonymity",
    icon: <SafetyOutlined />,
    children: [
      {
        key: "3",
        label: (
          <span style={textStyle}>
            Never attempt to identify or expose the confessor. Don't share personal information in confession threads.
          </span>
        ),
        disabled: true,
      },
    ],
  },
  {
    key: "sub4",
    label: "Keep the Space Safe",
    icon: <GlobalOutlined />,
    children: [
      {
        key: "4",
        label: (
          <span style={textStyle}>
            No harassment, mockery, or hostility toward confessions. Report serious issues through proper channels.
          </span>
        ),
        disabled: true,
      },
    ],
  },
];