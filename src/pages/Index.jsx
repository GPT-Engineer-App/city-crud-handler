import React, { useState, useEffect } from "react";
import { Container, VStack, Button, Input, List, ListItem, IconButton, useToast, Heading, Text } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const Index = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [editingCity, setEditingCity] = useState(null);
  const toast = useToast();

  const fetchCities = async () => {
    const response = await fetch("https://api.zerosheets.com/v1/pwh");
    const data = await response.json();
    setCities(data);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const addCity = async () => {
    if (!newCity) return;
    const response = await fetch("https://api.zerosheets.com/v1/pwh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCity }),
    });
    if (response.ok) {
      fetchCities();
      setNewCity("");
      toast({
        title: "City added.",
        description: `${newCity} has been added successfully.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteCity = async (lineNumber) => {
    const response = await fetch(`https://api.zerosheets.com/v1/pwh/${lineNumber}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchCities();
      toast({
        title: "City deleted.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const updateCity = async () => {
    if (!editingCity) return;
    const response = await fetch(`https://api.zerosheets.com/v1/pwh/${editingCity._lineNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // Ensure the "name" key is a string
      body: JSON.stringify({ name: newCity }),
    });
    if (response.ok) {
      fetchCities();
      setNewCity("");
      setEditingCity(null);
      toast({
        title: "City updated.",
        description: `City has been updated successfully.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md">
      <VStack spacing={4} mt="4">
        <Heading>City Manager</Heading>
        <Input placeholder="Add new city" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={editingCity ? updateCity : addCity}>
          {editingCity ? "Update City" : "Add City"}
        </Button>
        <List spacing={3} w="full">
          {cities.map((city) => (
            <ListItem key={city._lineNumber} d="flex" justifyContent="space-between" alignItems="center">
              <Text>{city.name}</Text>
              <div>
                <IconButton
                  aria-label="Edit city"
                  icon={<FaEdit />}
                  onClick={() => {
                    setEditingCity(city);
                    setNewCity(city.name);
                  }}
                />
                <IconButton aria-label="Delete city" icon={<FaTrash />} ml="2" colorScheme="red" onClick={() => deleteCity(city._lineNumber)} />
              </div>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
