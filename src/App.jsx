import { useCallback, useRef, useState } from 'react';
import logoImg from './assets/logo.png';
import Places from './components/Places';
import Modal from './components/Modal';
import DeleteConfirmation from './components/DeleteConfirmation';
import AvailablePlaces from './components/AvailablePlaces';
import { updateUserPlaces, deleteUserPlaces, fetchUserPlaces } from './http';
import Error from './components/Error';
import { useFetch } from './hooks/useFetch';

// const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
// const storedPlaces = storedIds.map((id) =>
//   AVAILABLE_PLACES.find((place) => place.id === id)
// );

// function App() {
//   const modal = useRef();
//   const selectedPlace = useRef();
//   const [userPlaces, setUserPlaces] = useState([]);
//   // const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

//   /*
//     To open the modal via Props
//    */

//     const [modalIsOpen, setModalIsOpen] = useState(false)
//   /*
//   useEffect(() => {
//     const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
//     const storedPlaces = storedIds.map((id) =>
//       AVAILABLE_PLACES.find((place) => place.id === id)
//     );
//     setPickedPlaces(storedPlaces);
//   }, []);
//   we can get this using the passing the storedPlaces to the initial value to state
//   */

//   // useEffect(() => {
//   //   navigator.geolocation.getCurrentPosition((position) => {
//   //     const sortedPosition = sortPlacesByDistance(
//   //       AVAILABLE_PLACES,
//   //       position.coords.latitude,
//   //       position.coords.longitude
//   //     );
//   //     setAvailablePlaces(sortedPosition);
//   //   });
//   // }, []);

//   function handleStartRemovePlace(id) {
//     // modal.current.open();
//     setModalIsOpen(true)
//     selectedPlace.current = id;
//   }

//   function handleStopRemovePlace() {
//     // modal.current.close();
//     setModalIsOpen(false)
//   }

//   function handleSelectPlace(id) {
//     setUserPlaces((prevPickedPlaces) => {
//       if (!prevPickedPlaces) {
//         prevPickedPlaces = [];
//       }
//       if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
//         return prevPickedPlaces;
//       }
//       return [selectedPlace, ...prevPickedPlaces];
//     });

//     const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
//     if (storedIds.indexOf(id) === -1) {
//       localStorage.setItem(
//         'selectedPlaces',
//         JSON.stringify([id, ...storedIds])
//       );
//     }
//   }

//   const handleRemovePlace = useCallback(function handleRemovePlace() {
//     setPickedPlaces((prevPickedPlaces) =>
//       prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
//     );
//     // modal.current.close();
//     setModalIsOpen(false)
//     const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
//     const filteredIds = storedIds.filter((id) => id !== selectedPlace.current);
//     localStorage.setItem('selectedPlaces', JSON.stringify(filteredIds));
//   }, [])

//   return (
//     <>
//       {/* <Modal ref={modal}> */}
//       <Modal openModal={modalIsOpen} onCloseModal={handleStopRemovePlace}>
//         <DeleteConfirmation
//           onConfirm={handleRemovePlace}
//           onCancel={handleStopRemovePlace}
//         />
//       </Modal>
//       <header>
//         <img src={logoImg} alt="Stylized globe" />
//         <h1>PlacePicker</h1>
//         <p>
//           Create your personal collection of places you would like to visit or
//           you have visited.
//         </p>
//       </header>

//       <main>
//         <Places
//           title="I'd like to visit ..."
//           fallbackText={'Select the places you would like to visit below.'}
//           places={userPlaces}
//           onSelectPlace={handleStartRemovePlace}
//         />
//         <AvailablePlaces onSelectPlace={handleSelectPlace} />
//       </main>
//     </>
//   );
// }

function App() {
  // const [userPlaces, setUserPlaces] = useState([]);
  //   const [isFetching, setFetching] = useState(false);
  //   const [error, setError] = useState();
  // useEffect(() => {
  //   async function getUserPlaces() {
  //     setFetching(true);
  //     try {
  //       const userPlaces = await fetchUserPlaces();
  //       setUserPlaces(userPlaces);
  //     } catch (err) {
  //       setError({ message: err.message || 'Failed to Fetch Places...' });
  //     }
  //     setFetching(false);
  //   }
  //   getUserPlaces();
  // }, []);

  const selectedPlace = useRef();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    isFetching,
    fetchedData: userPlaces,
    error,
    setFetchedData: setUserPlaces,
  } = useFetch(fetchUserPlaces, []);
  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (err) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: err.message || 'Failed to Update Place!',
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        await deleteUserPlaces(selectedPlace.current.id);
      } catch (err) {
        setErrorUpdatingPlaces({
          message: err.message || 'Failed to Delete Place!',
        });
      }
      setModalIsOpen(false);
    },
    [setUserPlaces]
  );

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal openModal={errorUpdatingPlaces} onCloseModal={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal openModal={modalIsOpen} onCloseModal={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occured" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching Your Visited Places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}
export default App;
