import * as React from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Table from '@mui/material/Table';
import NavList from "./NavList";
import {useEffect, useState} from "react";
import {Syllabus} from "../Models/Syllabus";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {useNavigate, useSearchParams} from "react-router-dom";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        SyllabIT
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open',})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth, width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
  '& .MuiDrawer-paper': {position: 'relative', whiteSpace: 'nowrap', width: drawerWidth,
    transition: theme.transitions.create('width', {easing: theme.transitions.easing.sharp, duration:
      theme.transitions.duration.enteringScreen,}),
    boxSizing: 'border-box', ...(!open && {overflowX: 'hidden', transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen,}),
      width: theme.spacing(7), [theme.breakpoints.up('sm')]: {width: theme.spacing(9),},
    }),},
  }),
);

const mdTheme = createTheme();

export default function MyTables() {
  const [open, setOpen] = React.useState(true);
  const [syllabuses, setSyllabuses] = useState(Array<Syllabus>())
  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  const [title, setTitle] = useState('Недавние');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1.0/syllabus/recent?status=${!!searchParams.get("status") ? searchParams.get("status") : ''}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
          }
        );
        if (response.status == 401) {
          localStorage.clear()
          window.location.reload();
        }
        let courses_json = await response.json();
        setSyllabuses(courses_json);
      } catch (err) {
        setSyllabuses([]);
      }
    }
    fetchSyllabuses()

    if (!!searchParams.get('status')){
      if (searchParams.get('status')=='ACTIVE'){
        setTitle('Активные проекты')
      } else if (searchParams.get('status')=='ON_APPROVING'){
        setTitle('Проекты на согласовании')
      } else if (searchParams.get('status')=='IN_PROGRESS'){
        setTitle('Проекты в работе')
      }
    }else{
      setTitle('Недавние проекты')
    }
  }, [searchParams])

  function rowClicked(id: Number){
    navigate(`/syllabus/view/${id}`)
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{display: 'flex'}}>
        <CssBaseline/>
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{pr: '24px'}}>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}
                        sx={{marginRight: '36px', ...(open && {display: 'none'}),}}>
              <MenuIcon/>
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
              {title}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary"><NotificationsIcon/></Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1],}}>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{flexGrow: 1, m: 2}}>
              SyllabIT
            </Typography>
            <IconButton onClick={toggleDrawer}><ChevronLeftIcon/></IconButton>
          </Toolbar>
          <Divider/>
          <NavList/>
        </Drawer>
        <Box
          component="main" sx={{
          flexGrow: 1, height: '100vh', overflow: 'auto',
          backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        }}
        >
          <Toolbar/>
          <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell>Номер</TableCell>
                        <TableCell>Курс</TableCell>
                        <TableCell>Год</TableCell>
                        <TableCell>Статус</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {syllabuses.map((s: Syllabus) => (
                        <TableRow hover onClick={()=>rowClicked(s.id)}>
                          <TableCell>{s.id?.toString()}</TableCell>
                          <TableCell>{s.course?.name}</TableCell>
                          <TableCell>{s.year}</TableCell>
                          <TableCell>{s.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{pt: 4}}/>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

