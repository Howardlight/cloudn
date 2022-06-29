import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

//TODO: Come back to this and Improve CSS
const Header = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar className="static bg-transparent backdrop-blur-sm shadow-transparent shadow-none">
                <Toolbar>
                    <Link href="/">
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            className="color-white opacity-75"
                            sx={{
                                mr: 2,
                                display: "flex",
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                textDecoration: 'none',
                                flexGrow: 1,
                            }}
                        >
                            CLOUDN
                        </Typography>
                    </Link>
                    <Link href="/about">
                        <Button className="font-semibold contrast-125 hover:contrast-150 hover:bg-slate-900 text-white bg-transparent opacity-75">
                            ABOUT
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header;