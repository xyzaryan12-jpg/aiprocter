import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useSelector } from 'react-redux';

const SidebarItems = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const pathDirect = pathname;

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // Check if the user is a student and if the item should be hidden
          if (
            userInfo.role === 'student' &&
            ['Create Challenge', 'Add MCQ Questions', 'Proctoring Logs'].includes(item.title)
          ) {
            return null;
          }
          if (item.subheader) {
            if (userInfo.role === 'student' && item.subheader === 'Organizer') {
              return null;
            }

            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return <NavItem item={item} key={item.id} pathDirect={pathDirect} />;
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
