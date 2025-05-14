// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getDestinationById } from "../services/destinationService";
// import { Destination } from "./types/types";
// import {
//   Button,
//   Card,
//   Container,
//   Row,
//   Col,
//   Spinner,
//   Image,
// } from "react-bootstrap";
// import { HeartIcon, CalendarIcon, MapPinIcon } from "lucide-react";

// const DestinationDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [destination, setDestination] = useState<Destination | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDestination = async () => {
//       try {
//         setLoading(true);
//         if (id) {
//           const data = await getDestinationById(id);
//           setDestination(data);
//         }
//       } catch (err) {
//         setError("Failed to load destination details");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDestination();
//   }, [id]);

//   if (loading) {
//     return (
//       <Container
//         className="d-flex justify-content-center align-items-center"
//         style={{ height: "50vh" }}
//       >
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   if (error || !destination) {
//     return (
//       <Container className="text-center mt-5">
//         <h2>Error</h2>
//         <p>{error || "Destination not found"}</p>
//         <Button variant="primary" onClick={() => navigate("/destinations")}>
//           Back to Destinations
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <Card className="border-0 shadow-sm">
//         <Row className="g-0">
//           <Col md={6}>
//             <Image
//               src={destination.imageUrl || "/placeholder-destination.jpg"}
//               alt={destination.name}
//               className="img-fluid rounded-start"
//               style={{ height: "100%", objectFit: "cover" }}
//             />
//           </Col>
//           <Col md={6}>
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start">
//                 <Card.Title as="h2" className="mb-3">
//                   {destination.name}
//                 </Card.Title>
//                 <Button variant="outline-danger" size="sm">
//                   <HeartIcon size={18} /> Save
//                 </Button>
//               </div>

//               <Card.Subtitle className="mb-3 text-muted d-flex align-items-center">
//                 <MapPinIcon size={16} className="me-1" />
//                 {destination.location}
//               </Card.Subtitle>

//               <Card.Text className="mb-4">{destination.description}</Card.Text>

//               <div className="mb-4">
//                 <h5>Highlights</h5>
//                 <ul className="list-unstyled">
//                   {destination.highlights?.map((highlight, index) => (
//                     <li key={index} className="mb-1">
//                       • {highlight}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="mb-4">
//                 <h5>Best Time to Visit</h5>
//                 <div className="d-flex align-items-center">
//                   <CalendarIcon size={16} className="me-2" />
//                   <span>{destination.bestTimeToVisit || "Year-round"}</span>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between align-items-center mt-4">
//                 <div>
//                   <h4 className="mb-0">${destination.price || "???"}</h4>
//                   <small className="text-muted">per person</small>
//                 </div>
//                 <Button
//                   variant="primary"
//                   onClick={() => navigate(`/book/${destination.id}`)}
//                 >
//                   Plan Your Trip
//                 </Button>
//               </div>
//             </Card.Body>
//           </Col>
//         </Row>
//       </Card>

//       <div className="mt-4">
//         <Button variant="outline-secondary" onClick={() => navigate(-1)}>
//           Back
//         </Button>
//       </div>
//     </Container>
//   );
// };

// export default DestinationDetails;
