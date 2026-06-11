import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import {
    EditOutlined,
    LinkOutlined,
    FlagOutlined,
    ShareAltOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import ReportPostModal from '../ReportPostModal';
import handleDeletePost from './deletePost';
import handleCopyLink from './copyLink';

const DotDropDown = ({ ownerId, post_type, post_id, page, text_body, contentId }) => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [openReport, setOpenReport] = useState(false);

  const isOwner = Number(ownerId) === Number(user.id);

  const menuItemsForAll = [
    {
      label: (
        <li onClick={() => handleCopyLink(post_id)}>
          <LinkOutlined /> Copy link
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li onClick={() => setOpenReport(true)}>
          <FlagOutlined /> Report Post
          <ReportPostModal
            open={openReport}
            setOpen={setOpenReport}
            postId={post_id}
          />
        </li>
      ),
      key: "1",
    },
  ];

  const menuItemsForOwner = [
    post_type === "content" && {
      label: (
        <li
          onClick={(e) => {
            e.stopPropagation();
            navigate("/edit/content", {
              state: { postId: post_id, contentId, bodyText: text_body, page, mode: "edit" },
            });
          }}
        >
          <EditOutlined /> Edit Text Body
        </li>
      ),
      key: "0",
    },
    {
      label: (
        <li onClick={() => handleDeletePost(post_id)}>
          <DeleteOutlined /> Delete
        </li>
      ),
      key: "1",
    },
    {
      label: (
        <li onClick={() => handleCopyLink(post_id)}>
          <LinkOutlined /> Copy link
        </li>
      ),
      key: "2",
    },
    {
      label: (
        <li onClick={() => setOpenReport(true)}>
          <FlagOutlined /> Report Post
          <ReportPostModal
            open={openReport}
            setOpen={setOpenReport}
            postId={post_id}
          />
        </li>
      ),
      key: "3",
    },
  ].filter(Boolean);

  return (
    <Dropdown
      menu={{ items: isOwner ? menuItemsForOwner : menuItemsForAll }}
      trigger={["click"]}
      classNames={{ root: "profile-dropdown" }}
    >
      <div className="post-header-right">
        <FontAwesomeIcon icon={faEllipsisVertical} className="icon-formore" />
      </div>
    </Dropdown>
  );
};

export default DotDropDown;