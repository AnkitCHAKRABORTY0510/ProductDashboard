import { Box, Typography, useTheme, Avatar, Grid } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import Header from "../../components/Header";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import LockIcon from "@mui/icons-material/Lock";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

const UserProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <Box m="20px">
      <Header title="User Profile" subtitle="Detailed user information" />

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar alt={user.firstName} src={user.image} sx={{ width: 80, height: 80 }} />
        <Typography variant="h4">
          {user.firstName} {user.lastName}
        </Typography>
      </Box>

      {/* Personal Info */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            <AccountCircleIcon sx={{ mr: 1 }} /> Personal Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography><strong>Username:</strong> {user.username}</Typography>
          <Typography><strong>Birth Date:</strong> {user.birthDate}</Typography>
          <Typography><strong>Gender:</strong> {user.gender}</Typography>
          <Typography><strong>Blood Group:</strong> {user.bloodGroup}</Typography>
          <Typography><strong>Eye Color:</strong> {user.eyeColor}</Typography>
          <Typography><strong>Hair:</strong> {user.hair?.color}, {user.hair?.type}</Typography>
          <Typography><strong>Height:</strong> {user.height} cm</Typography>
          <Typography><strong>Weight:</strong> {user.weight} kg</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Contact Info */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            <PhoneIcon sx={{ mr: 1 }} /> Contact Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography><EmailIcon fontSize="small" sx={{ mr: 1 }} />{user.email}</Typography>
          <Typography><PhoneIcon fontSize="small" sx={{ mr: 1 }} />{user.phone}</Typography>
          <Typography><HomeIcon fontSize="small" sx={{ mr: 1 }} />{user.address?.address}, {user.address?.city}, {user.address?.state}, {user.address?.country} - {user.address?.postalCode}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Company Info */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            <BusinessIcon sx={{ mr: 1 }} /> Company Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography><strong>Company:</strong> {user.company?.name}</Typography>
          <Typography><strong>Title:</strong> {user.company?.title}</Typography>
          <Typography><strong>Department:</strong> {user.company?.department}</Typography>
          <Typography><strong>Company Address:</strong> {user.company?.address?.address}, {user.company?.address?.city}, {user.company?.address?.state} - {user.company?.address?.postalCode}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Bank & Crypto */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            <CreditCardIcon sx={{ mr: 1 }} /> Financial Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography><strong>Card Number:</strong> {user.bank?.cardNumber}</Typography>
          <Typography><strong>Expires:</strong> {user.bank?.cardExpire}</Typography>
          <Typography><strong>Card Type:</strong> {user.bank?.cardType}</Typography>
          <Typography><strong>Currency:</strong> {user.bank?.currency}</Typography>
          <Typography><strong>IBAN:</strong> {user.bank?.iban}</Typography>
          <Typography><WalletIcon fontSize="small" sx={{ mr: 1 }} /><strong>Crypto:</strong> {user.crypto?.coin} ({user.crypto?.network})</Typography>
          <Typography><strong>Wallet:</strong> {user.crypto?.wallet}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Security */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            <LockIcon sx={{ mr: 1 }} /> Security Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography><FingerprintIcon fontSize="small" sx={{ mr: 1 }} />SSN: {user.ssn}</Typography>
          <Typography><strong>EIN:</strong> {user.ein}</Typography>
          <Typography><strong>MAC:</strong> {user.macAddress}</Typography>
          <Typography><strong>IP:</strong> {user.ip}</Typography>
          <Typography><strong>User Agent:</strong> {user.userAgent}</Typography>
          <Typography><strong>Role:</strong> {user.role}</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default UserProfile;
