"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useUser } from "./UserContext";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Org Chart", href: "/org-chart" },
    { label: "Process Flow", href: "/process-flow" },
  ];
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Stanfield Demo
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {navLinks.map(link => (
            <Button
              key={link.href}
              color="inherit"
              component={Link}
              href={link.href}
              sx={{ 
                fontWeight: pathname === link.href ? 700 : 400, 
                borderBottom: pathname === link.href ? '2px solid #fff' : 'none',
                minWidth: 'auto',
                px: 2
              }}
            >
              {link.label}
            </Button>
          ))}
          {user ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                href="/dashboard" 
                sx={{ 
                  fontWeight: pathname === "/dashboard" ? 700 : 400, 
                  borderBottom: pathname === "/dashboard" ? '2px solid #fff' : 'none',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                onClick={() => { logout(); router.push("/login"); }}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              href="/login" 
              sx={{ 
                fontWeight: pathname === "/login" ? 700 : 400, 
                borderBottom: pathname === "/login" ? '2px solid #fff' : 'none',
                minWidth: 'auto',
                px: 2
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 