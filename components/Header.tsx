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
        <AppBar position="static" sx={{overflow: 'hidden'}}>
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
                            <Button className="font-semibold" variant="contained" sx={{color: "white"}}>
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