import * as React from "react";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Divider from "@mui/material/Divider";
import {Architecture, Archive, Done, ExitToApp, HowToReg} from "@mui/icons-material";
import List from "@mui/material/List";
import { Link } from "react-router-dom";

export default function NavList() {
  async function logout() {
    localStorage.clear()
    window.location.reload();
  }
  return(
    <List component="nav">
      <React.Fragment>
        <ListItemButton component={Link} to="/my-tables">
          <ListItemIcon><DashboardIcon/></ListItemIcon>
          <ListItemText primary="Недавние"/>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon><PeopleIcon/></ListItemIcon>
          <ListItemText primary="Профиль"/>
        </ListItemButton>
        <ListItemButton component={Link} to="/syllabus/form">
          <ListItemIcon><AssignmentIcon/></ListItemIcon>
          <ListItemText primary="Создать проект"/>
        </ListItemButton>
      </React.Fragment>
      <Divider sx={{my: 1}}/>
      <ListItemButton component={Link} to="/my-tables?status=ACTIVE">
        <ListItemIcon><Done/></ListItemIcon>
        <ListItemText primary="Активные"/>
      </ListItemButton>
      <ListItemButton component={Link} to="/my-tables?status=IN_PROGRESS" >
        <ListItemIcon><Architecture/></ListItemIcon>
        <ListItemText primary="Проекты"/>
      </ListItemButton>
      <ListItemButton component={Link} to="/my-tables?status=ON_APPROVING" >
        <ListItemIcon><HowToReg/></ListItemIcon>
        <ListItemText primary="На согласовании"/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon><Archive/></ListItemIcon>
        <ListItemText primary="Архив"/>
      </ListItemButton>
      <Divider sx={{my: 1}}/>
      <ListItemButton>
        <ListItemIcon><ExitToApp/></ListItemIcon>
        <ListItemText primary="Выйти" onClick={logout}/>
      </ListItemButton>
    </List>
  )
}
