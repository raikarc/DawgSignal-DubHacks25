import React, { useState } from "react";
import { invoke } from "@forge/bridge";
import { Box, Button, Text } from "@forge/react";

const App = () => {
  const [result, setResult] = useState("Click to find your closest bus stop");

  const handleClick = async () => {
    const data = await invoke("findClosestBusStop");
    setResult(`Closest stop: ${data.stop} (${data.distance} km away)`);
  };

  return (
    <Box padding="space.200">
      <Text>{result}</Text>
      <Button appearance="primary" onClick={handleClick}>
        Find My Closest Stop
      </Button>
    </Box>
  );
};

export default App;
