import React, { useState, useEffect } from "react";
import { ChakraProvider, Container, Box, Text, VStack, Spinner, Table, Thead, Tbody, Tr, Th, Td, Link as ChakraLink } from "@chakra-ui/react";
import getEnvironment from '../getenvironment';

const apiUrl = getEnvironment();

const AllocatedRolesPage = () => {
  const [allocatedRoles, setAllocatedRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState('');

  useEffect(() => {
    const fetchAllocatedRoles = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/getuser`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error("Failed to fetch allocated roles");
        }

        const userdetails = await response.json();
        console.log('Fetched user details:', userdetails); // Log the fetched data
        setAllocatedRoles(userdetails.user.role.filter(role => role)); // Filter out empty roles
        setUser(userdetails.user);
      } catch (error) {
        console.error("Error fetching allocated roles:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllocatedRoles();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <ChakraProvider>
      <Container maxW="container.lg">
        <Box p={4}>
          {isLoading ? (
            <Spinner />
          ) : (
            <VStack spacing={4} align="center">
              {user && (
                <>
                  <Text fontSize="xl">Welcome, {user.email}!</Text>
                </>
              )}
              <Table variant="striped" colorScheme="teal" size="md">
                <Thead>
                  <Tr>
                    <Th>S.No</Th>
                    <Th>Role Allotted</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allocatedRoles.map((role, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>
                        {role === "ITTC" && <Text>Institute Time Table Coordinator</Text>}
                        {role === "DTTI" && <Text>Department Time Table Coordinator</Text>}
                        {role === "CM" && <Text>Event Certificate Manager</Text>}
                        {role === "admin" && <Text>XCEED Super User</Text>}
                        {role === "EO" && <Text>Event Organiser</Text>}
                        {role === "editor" && <Text>Paper Review Management</Text>}
                        {role === "PRM" && <Text>PRM</Text>}
                        {role === "FACULTY" && <Text>Faculty</Text>}
                      </Td>
                      <Td>
                        {role === "ITTC" && (
                          <ChakraLink href="/tt/admin" color="teal.500">
                            ITTC Admin Page
                          </ChakraLink>
                        )}
                        {role === "DTTI" && (
                          <ChakraLink href="/tt/dashboard" color="teal.500">
                            Time Table Dashboard
                          </ChakraLink>
                        )}
                        {role === "CM" && (
                          <ChakraLink href="/cm/dashboard" color="teal.500">
                            Certificate Management Dashboard
                          </ChakraLink>
                        )}
                        {role === "admin" && (
                          <ChakraLink href="/superadmin" color="teal.500">
                            XCEED Admin Dashboard
                          </ChakraLink>
                        )}
                        {role === "EO" && (
                          <ChakraLink href="/cf/dashboard" color="teal.500">
                            Event Manager
                          </ChakraLink>
                        )}
                        {role === "editor" && (
                          <ChakraLink href="/prm/dashboard" color="teal.500">
                            Review Manager
                          </ChakraLink>
                        )}
                       
                        {role === "FACULTY" && (
                          <ChakraLink href="/prm/home" color="teal.500">
                            Faculty
                          </ChakraLink>
                        )}
                        {role === "PRM" && (
                          <ChakraLink href="/prm/home" color="teal.500">
                            PRM Home
                          </ChakraLink>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          )}
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default AllocatedRolesPage;
