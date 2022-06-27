import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

//TODO: Come back to this and Improve CSS
const Header = () => {
    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" className="bg-transparent backdrop-blur-sm shadow-transparent">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        className="color-white opacity-75"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            textDecoration: 'none',
                            flexGrow: 1,
                        }}
                    >
                        CLOUDN
                    </Typography>
                    <Button className="font-semibold contrast-125 hover:contrast-150 hover:bg-slate-900 text-white bg-transparent opacity-75">
                        ABOUT
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header;