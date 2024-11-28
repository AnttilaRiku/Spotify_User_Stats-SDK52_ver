import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Käytetään tummaa taustaa, joka on määritelty teemassa
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b3b3b3', 
  },
  email: {
    fontSize: 16,
    color: '#b3b3b3', 
  },
  topTracksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#b3b3b3',
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  trackText: {
    fontSize: 16,
    color: '#b3b3b3', 
  },
  link: {
    color: '#1db954', 
    textDecorationLine: 'underline',
  },
  
  //WIP TEST
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1db954', 
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 18,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  genreText: {
    fontSize: 16,
    color: '#fff',
    padding: 8,
  },
  closeButton: {
    alignSelf: 'flex-end', // Asettaa oikeaan yläkulmaan
    margin: 10,            // Väli reunoista
    backgroundColor: '#1db954', // Tausta mustaksi
    padding: 5,            // Nappi tilavammaksi
    borderRadius: 15,      // Pyöreät kulmat
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tumma läpinäkyvä tausta
  },
  menu: {
    backgroundColor: '#121212', 
    borderRadius: 10,          // Pyöristetyt kulmat
    padding: 20,               // Tilaa sisällölle
    margin: 20,                // Modalin reunoihin etäisyys
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1db954', // Erotteluraja
  },
  menuText: {
    color: '#fff', 
    fontSize: 18,
    textAlign: 'center',
  },
 
});

export default styles;
