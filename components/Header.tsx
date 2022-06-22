import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const Header = () => {

    //TODO: Come back to this and Improve CSS
    return (
        <AppBar position="static" sx={{overflow: 'hidden', background: "rgba(10, 25, 41, 0.7)", backdropFilter: "blur(20px)"}}>
            <Container maxWidth="xl" className='backdrop-blur-sm'>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            flexGrow: "1",
                        }}
                    >
                        CLOUDN
                    </Typography>
                    <Box sx={{ flexGrow: 0 }}>
                        {/* <Tooltip title="Redirects to About Section"> */}
                            <Button className="font-semibold contrast-125 hover:contrast-150 hover:bg-transparent" sx={{color: "rgba(178, 186, 194)", backgroundColor: "rgba(10, 25, 41)"}}>
                                ABOUT
                            </Button>
                        {/* </Tooltip> */}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;