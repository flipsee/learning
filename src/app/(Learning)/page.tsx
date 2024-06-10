"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/components/PageContainer";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="my Learning Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            Learning Dashboard
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
