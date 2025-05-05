// Bloom It - App with Home, Explore, Profile, and Services
import React, { useState, useEffect, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './AuthContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Import the screens from their new location
import AuthStack from './screens/AuthStack';
import ProfileScreenWithAuth from './screens/ProfileScreenWithAuth';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const PlantLibraryStack = createNativeStackNavigator();

// Error Boundary component to catch JS errors
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
    // Attempt to reload the app
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8DBF8D', padding: 20 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity 
            style={{
              backgroundColor: '#6FBF7F',
              padding: 15,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#fff'
            }}
            onPress={this.handleRestart}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Restart App</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Main App with authentication
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// App Navigator for conditional routing
function AppNavigator() {
  const { user, loading, authError } = useAuth();

  // Show loading screen while auth state is determining
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8DBF8D' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Show error screen if authentication fails to initialize
  if (authError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8DBF8D', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Authentication Error
        </Text>
        <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
          {authError}
        </Text>
        <TouchableOpacity 
          style={{
            backgroundColor: '#6FBF7F',
            padding: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#fff'
          }}
          onPress={() => {
            // Attempt to reload the app
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Show either Auth stack or Main app based on user login state
  return user ? <Tabs /> : <AuthStack />;
}

function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const userName = user ? (user.displayName || user.email?.split('@')[0] || 'User') : 'User';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.standardHeader}>
        <Image
          source={{ uri: 'https://i.ibb.co/gZjW84Yj/b9.png' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.welcomeText}>Welcome {userName}</Text>
          <Text style={styles.location}>☀ Eastern Al-jubail 29°C</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Services')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.serviceCardWrap}>
            <TouchableOpacity onPress={() => navigation.navigate('PlantLibrary')}>
              <View style={styles.serviceCardHorizontal}>
                <Image
                  source={{ uri: 'https://i.ibb.co/zHTjx93h/images-9.jpg' }}
                  style={styles.serviceImageHorizontal}
                />
                <Text style={styles.serviceLabel}>Library</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Volunteering')}>
              <View style={styles.serviceCardHorizontal}>
                <Image
                  source={{ uri: 'https://i.ibb.co/84r4KC2F/b2.jpg' }}
                  style={styles.serviceImageHorizontal}
                />
                <Text style={styles.serviceLabel}>Volunteer</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ToDoList')}>
              <View style={styles.serviceCardHorizontal}>
                <Image
                  source={{ uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' }}
                  style={styles.serviceImageHorizontal}
                />
                <Text style={styles.serviceLabel}>To-Do List</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last News</Text>
        <View style={styles.newsCard}>
          <Image
            source={{ uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' }}
            style={styles.newsImage}
          />
          <View style={styles.newsTextContainer}>
            <Text style={styles.newsText}>
              130 trees were planted by volunteers of all ages during the past month in Jubail
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function ServicesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
      </View>
      <View style={{ padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.navigate('PlantLibrary')}>
          <Image source={{ uri: 'https://i.ibb.co/zHTjx93h/images-9.jpg' }} style={styles.serviceCard} />
          <Text style={styles.serviceLabel}>Library</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Volunteering')}>
          <Image source={{ uri:  'https://i.ibb.co/84r4KC2F/b2.jpg' }} style={styles.serviceCard} />
          <Text style={styles.serviceLabel}>Volunteer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ToDoList')}>
          <Image source={{ uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' }} style={styles.serviceCard} />
          <Text style={styles.serviceLabel}>To-Do List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.standardHeader}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://i.ibb.co/gZjW84Yj/b9.png' }}
          style={styles.profileAvatar}
        />
        <Text style={styles.profileName}>Manar</Text>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('AboutUs')}
      >
        <Ionicons name="information-circle-outline" size={24} color="#508D69" />
        <Text style={styles.menuItemText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('FAQ')}
      >
        <Ionicons name="help-circle-outline" size={24} color="#508D69" />
        <Text style={styles.menuItemText}>FAQ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreenWithAuth} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8BC34A',
        },
        headerTintColor: '#fff',
      }}
    >
      <HomeStack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <HomeStack.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="PlantLibrary" 
        component={PlantLibraryScreen} 
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="Volunteering" 
        component={VolunteeringScreen} 
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="ToDoList" 
        component={ToDoListScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* Plant Detail Screens */}
      <HomeStack.Screen 
        name="ZamiaScreen" 
        component={ZamiaScreen} 
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="SnakePlantScreen" 
        component={SnakePlantScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="MonsteraScreen" 
        component={MonsteraScreen} 
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="JapaneseScreen" 
        component={JapaneseScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="RubberTreeScreen" 
        component={RubberTreeScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="PostScreen" 
        component={PostScreen} 
        options={{ headerShown: false }} 
      />
      
      <HomeStack.Screen 
        name="SunflowerScreen" 
        component={SunflowerScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="RosesScreen" 
        component={RosesScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="LemonTreeScreen" 
        component={LemonTreeScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="CapsicumScreen" 
        component={CapsicumScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="StrawberryScreen" 
        component={StrawberryScreen}
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="HibiscusScreen" 
        component={HibiscusScreen}
        options={{ headerShown: false }} 
      />
    </HomeStack.Navigator>
  );
}

function ProfileStackScreenWithAuth() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="MyProfile"
        component={ProfileScreenWithAuth}
        options={{
          title: 'My Profile',
          headerStyle: { backgroundColor: '#8BC34A' },
          headerTintColor: '#fff',
        }}
      />
      <ProfileStack.Screen
        name="About"
        component={AboutUsScreen}
        options={{
          title: 'About Us',
          headerStyle: { backgroundColor: '#8BC34A' },
          headerTintColor: '#fff',
        }}
      />
      <ProfileStack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          title: 'Frequently Asked Questions',
          headerStyle: { backgroundColor: '#8BC34A' },
          headerTintColor: '#fff',
        }}
      />
    </ProfileStack.Navigator>
  );
}

// About Us Screen Component
function AboutUsScreen() {
  // Define the location of your business
  const location = {
    latitude: 26.958676,  // Coordinates from the Google Maps link
    longitude: 49.663517,
    latitudeDelta: 0.01,   // Zoom level (smaller values = more zoomed in)
    longitudeDelta: 0.01
  };

  const [mapError, setMapError] = useState(false);

  // Handle map loading errors
  const handleMapError = () => {
    setMapError(true);
  };

  // Open location in Google Maps
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.standardHeader}>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>
      
      <View style={styles.aboutContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' }} 
          style={styles.aboutImage} 
        />
        
        <Text style={styles.aboutTitle}>Our Mission</Text>
        <Text style={styles.aboutText}>
          Our mission is to provide a platform where plant enthusiasts can share knowledge, 
          connect with each other, and contribute to a greener community. 
          We believe that by sharing our love for plants, we can create a more sustainable environment.
        </Text>
        
        <Text style={styles.aboutTitle}>Who We Are</Text>
        <Text style={styles.aboutText}>
          Bloom It was founded in 2023 by a group of plant enthusiasts who 
          wanted to create a space where people could learn about plants, 
          share their experiences, and join community activities.
        </Text>
        
        <Text style={styles.aboutTitle}>What We Do</Text>
        <Text style={styles.aboutText}>
          We provide resources for plant care, organize community planting 
          events, and create opportunities for plant lovers to connect and share.
        </Text>
        
        <Text style={styles.aboutTitle}>Visit Us</Text>
        <Text style={styles.aboutText}>
          Come visit our garden center and plant shop in Al-Jubail.
        </Text>
        
        {/* Map Component with Fallback */}
        <View style={styles.mapContainer}>
          {!mapError ? (
            <MapView 
              style={styles.map}
              initialRegion={location}
              onError={handleMapError}
            >
              <Marker 
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude
                }}
                title="Bloom It"
                description="Your trusted partner in plant care"
              />
            </MapView>
          ) : (
            <View style={[styles.map, styles.mapFallback]}>
              <Image 
                source={{ uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' }} 
                style={styles.mapFallbackImage} 
              />
              <Text style={styles.mapFallbackText}>
                Map couldn't be loaded. Tap below to view our location.
              </Text>
              <TouchableOpacity 
                style={styles.mapFallbackButton}
                onPress={openInGoogleMaps}
              >
                <Text style={styles.mapFallbackButtonText}>Open in Google Maps</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <Text style={styles.aboutTitle}>Contact Us</Text>
        <Text style={styles.aboutText}>
          Email: bloomit@gmail.com{'\n'}
          Instagram: @bloom_it{'\n'}
          Phone: 0566677700
        </Text>
      </View>
    </ScrollView>
  );
}

// FAQ Screen Component
function FAQScreen() {
  const faqs = [
    {
      question: 'How do I deal with fungi?',
      answer:
        'Remove affected leaves, improve air circulation, avoid overhead watering, and apply appropriate antifungal.',
      image: { uri: 'https://i.ibb.co/84r4KC2F/b2.jpg' },
    },
    {
      question: 'What is the cause of the leaves curling?',
      answer:
        'Can be caused by: underwatering, overwatering, pest infestations, nutrient deficiencies, or environmental stress like temperature fluctuations.',
      image: { uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' },
    },
    {
      question: 'What is the cause of lemon tree death?',
      answer:
        'Overwatering, poor drainage, pest infestations, nutrient deficiencies, diseases like citrus greening, or environmental stress from extreme temperatures.',
      image: { uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' },
    },
    {
      question: 'Why are my houseplant leaves turning yellow?',
      answer:
        'Yellowing leaves can indicate overwatering, underwatering, nutrient deficiencies, or inadequate light conditions.',
      image: { uri: 'https://i.ibb.co/zHTjx93h/images-9.jpg' },
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.standardHeader}>
        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      <View style={styles.introBox}>
        <Text style={styles.introText}>
          Here you will find answers to commonly asked questions:
        </Text>
      </View>

      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Image source={faq.image} style={styles.faqImage} />
          <View style={styles.faqTextBox}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// Plant Library Screen Component
function PlantLibraryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Plant data
  const plants = [
    // Indoor Plants
    { 
      name: 'Zamia', 
      type: 'indoor', 
      image: { uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' },
      screen: 'ZamiaScreen'
    },
    { 
      name: 'Snake Plant', 
      type: 'indoor', 
      image: { uri: 'https://i.ibb.co/84r4KC2F/b2.jpg' },
      screen: 'SnakePlantScreen'
    },
    { 
      name: 'Monstera', 
      type: 'indoor', 
      image: { uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' },
      screen: 'MonsteraScreen'
    },
    { 
      name: 'Japanese', 
      type: 'indoor', 
      image: { uri: 'https://i.ibb.co/zHTjx93h/images-9.jpg' },
      screen: 'JapaneseScreen'
    },
    { 
      name: 'Rubber Tree', 
      type: 'indoor', 
      image: { uri: 'https://i.ibb.co/hRW7pJV1/b4.jpg' },
      screen: 'RubberTreeScreen'
    },
    { 
      name: 'Pots', 
      type: 'indoor', 
      image: { uri: 'https://i.ibb.co/hRW7pJV1/b4.jpg' },
      screen: 'PostScreen'
    },

    // Outdoor Plants
    { 
      name: 'Sunflower', 
      type: 'outdoor', 
      image: { uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' },
      screen: 'SunflowerScreen'
    },
    { 
      name: 'Roses', 
      type: 'outdoor', 
      image: { uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' },
      screen: 'RosesScreen'
    },
    { 
      name: 'Lemon tree', 
      type: 'outdoor', 
      image: { uri: 'https://i.ibb.co/84r4KC2F/b2.jpg' },
      screen: 'LemonTreeScreen'
    },
    { 
      name: 'Capsicum annuum', 
      type: 'outdoor', 
      image: { uri: 'https://i.ibb.co/zHTjx93h/images-9.jpg' },
      screen: 'CapsicumScreen'
    },
    { 
      name: 'Strawberries', 
      type: 'outdoor', 
      image: { uri: 'https://cdn.pixabay.com/photo/2016/04/15/08/04/strawberry-1330459_1280.jpg' },
      screen: 'StrawberryScreen'
    },
    { 
      name: 'Hibiscus', 
      type: 'outdoor', 
      image: { uri: 'https://i.ibb.co/hRW7pJV1/b4.jpg' },
      screen: 'HibiscusScreen'
    },
  ];

  // Filter plants based on type and search query
  const filteredPlants = plants.filter((plant) => {
    const matchType = filterType === 'all' || plant.type === filterType;
    const matchName = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchName;
  });

  // Render a single plant card
  const renderPlant = ({ item }) => (
    <TouchableOpacity 
      style={styles.plantCard}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Image source={item.image} style={styles.plantImage} />
      <Text style={styles.plantType}>
        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
      </Text>
      <Text style={styles.plantName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.plantLibraryContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Best Plant For{'\n'}Green Community
        </Text>
      </View>

      <TextInput
        style={styles.plantSearch}
        placeholder="Search plant"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.plantFilters}>
        {['all', 'indoor', 'outdoor'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton, 
              filterType === type && styles.activeFilter
            ]}
            onPress={() => setFilterType(type)}
          >
            <Text 
              style={
                filterType === type 
                ? styles.activeFilterText 
                : styles.filterText
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPlants}
        renderItem={renderPlant}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.plantList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// To-Do List Screen Component
function ToDoListScreen({ navigation }) {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Water the plants', completed: false },
    { id: '2', text: 'Fertilize the garden', completed: true },
    { id: '3', text: 'Prune the roses', completed: false },
    { id: '4', text: 'Check for pests', completed: false },
    { id: '5', text: 'Repot the monstera', completed: true },
  ]);
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity style={styles.taskCheckbox} onPress={() => toggleTask(item.id)}>
        {item.completed ? (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#757575" />
        )}
      </TouchableOpacity>
      
      <Text style={[
        styles.taskText,
        item.completed && styles.taskTextCompleted
      ]}>
        {item.text}
      </Text>
      
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.todoContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Plant Care Tasks</Text>
      </View>
      
      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.addTaskInput}
          placeholder="Add a new task..."
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.taskList}
      />
    </View>
  );
}

// Volunteering Screen Component
function VolunteeringScreen({ navigation }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const opportunities = [
    {
      id: '1',
      title: 'Community Garden Clean-up',
      date: 'June 15, 2023',
      location: 'Jubail Community Garden',
      description: 'Help us clean up and prepare the community garden for summer planting. Bring gloves and wear comfortable clothes.',
      image: { uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' }
    },
    {
      id: '2',
      title: 'Tree Planting Day',
      date: 'July 5, 2023',
      location: 'Al-Jubail Coastal Road',
      description: 'Join us in planting native trees along the coastal road. All materials and refreshments will be provided.',
      image: { uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' }
    },
    {
      id: '3',
      title: 'Plant Education Workshop',
      date: 'July 20, 2023',
      location: 'Bloom It Center',
      description: 'Volunteer to help teach children about plant care and sustainability through fun, interactive activities.',
      image: { uri: 'https://i.ibb.co/84r4KC2F/b2.jpg' }
    }
  ];

  const handleJoin = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteering</Text>
      </View>
      
      <Text style={styles.volunteerIntro}>
        Join our community of plant enthusiasts and make a positive impact on the environment. 
        Check out these volunteering opportunities and get involved!
      </Text>
      
      {opportunities.map(opportunity => (
        <View key={opportunity.id} style={styles.opportunityCard}>
          <Image source={opportunity.image} style={styles.opportunityImage} />
          
          <View style={styles.opportunityDetails}>
            <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
            
            <View style={styles.opportunityInfo}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{opportunity.date}</Text>
            </View>
            
            <View style={styles.opportunityInfo}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{opportunity.location}</Text>
            </View>
            
            <Text style={styles.opportunityDescription}>
              {opportunity.description}
            </Text>
            
            <TouchableOpacity style={styles.signupButton} onPress={handleJoin}>
              <Text style={styles.signupButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      {showSuccessModal && (
        <View style={styles.successModal}>
          <View style={styles.successModalContent}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            <Text style={styles.successModalText}>You have joined successfully!</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Zamia Plant Detail Screen
function ZamiaScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zamia</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Zamia, or Cardboard Palm, is a hardy, drought-tolerant plant with glossy green leaves. 
          It thrives in bright, indirect light, needs minimal watering, and is ideal for indoor or outdoor spaces.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Loves bright, indirect light. Can survive low light 
              but won't thrive.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Watering</Text>
            <Text style={styles.tipText}>
              Water every 2 weeks. Let soil dry completely between waterings.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☁️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Humidity</Text>
            <Text style={styles.tipText}>
              Enjoys normal room humidity. No misting needed!
            </Text>
          </View>
        </View>

        {/* Tip 4 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🍃</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Difficulty</Text>
            <Text style={styles.tipText}>
              Beginner-friendly. Very low maintenance.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Snake Plant Detail Screen
function SnakePlantScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Snake Plant</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/84r4KC2F/b2.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Snake plant is a good choice for beginners because it tolerates a range of growing conditions. 
          This low-maintenance container plant adds decorative interest when planted indoors.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Place it in bright, indirect sunlight. Avoid direct sunlight, which can scorch its leaves.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Watering plants every two weeks for optimal growth and health.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🌱</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Humidity</Text>
            <Text style={styles.tipText}>
              More sunlight is beneficial for plants, as it supports photosynthesis and promotes healthy growth.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Monstera Plant Detail Screen
function MonsteraScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monstera</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Monstera Deliciosa, also known as the Swiss Cheese Plant, is a popular houseplant admired for its large, 
          glossy leaves and unique leaf fenestrations that resemble Swiss cheese. This tropical beauty can add a 
          touch of lushness to any indoor space.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Place it in a well-lit spot, but avoid direct sunlight, as it can scorch the leaves.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Allow the top inch of the soil to dry out before watering.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☁️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Humidity</Text>
            <Text style={styles.tipText}>
              Increase humidity by misting the leaves with water or placing the plant near a humidifier.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Japanese Plant Detail Screen
function JapaneseScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Japanese</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/zHTjx93h/images-9.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Japanese Maple is an ornamental tree known for its vibrant, seasonal colors and delicate, lobed leaves. 
          It thrives in partial shade and well-drained soil, making it ideal for gardens and patios.
        </Text>

        <Text style={styles.careTipsTitle}>🍁 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Place it in partial shade to protect it from harsh afternoon sun.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Keep the soil consistently moist, but avoid water-logging.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🌲</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Pruning</Text>
            <Text style={styles.tipText}>
              Prune in late winter or early spring to maintain shape and remove dead or damaged branches.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Rubber Tree Plant Detail Screen
function RubberTreeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rubber Tree</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/hRW7pJV1/b4.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          The Rubber Tree is a beautiful indoor plant with shiny, thick leaves that add a touch of green to any space. 
          It's great for improving air quality, making it a popular choice for homes and offices.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Place it in bright, indirect sunlight. Avoid direct sunlight, which can scorch its leaves.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Water when the top inch of soil feels dry, but don't over-water — rubber trees dislike soggy soil.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☁️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Humidity</Text>
            <Text style={styles.tipText}>
              Maintain moderate humidity and occasionally wipe its leaves with a damp cloth to keep them clean and shiny.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Post (Pots) Plant Detail Screen
function PostScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pots Plant</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/hRW7pJV1/b4.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Potted plants are versatile, decorative, and easy to care for, adding greenery to any space with proper light, 
          watering, and occasional fertilization.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Ensure the plant gets the right amount of sunlight based on its needs — some prefer bright light, while others thrive in shade.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Water when the soil is dry, avoiding overwatering to prevent root rot.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🍃</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Fertilization</Text>
            <Text style={styles.tipText}>
              Feed the plant with appropriate fertilizer every few weeks during the growing season.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Roses Plant Detail Screen
function RosesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Roses</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/fY9qTcWV/images-10.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Roses are beloved flowering shrubs known for their beautiful blooms and captivating fragrances. 
          They come in various colors and varieties, making them a popular choice for gardens and landscaping.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Requires 6-8 hours of direct sunlight daily for optimal blooming.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Watering</Text>
            <Text style={styles.tipText}>
              Water deeply once or twice weekly, depending on climate. Avoid overhead watering.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🌱</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Soil</Text>
            <Text style={styles.tipText}>
              Prefers well-draining, slightly acidic soil rich in organic matter.
            </Text>
          </View>
        </View>

        {/* Tip 4 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>✂️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Pruning</Text>
            <Text style={styles.tipText}>
              Prune in early spring before new growth. Remove dead or diseased branches.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sunflower Plant Detail Screen
function SunflowerScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sunflower</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/7M0jnDQ/b3.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          A sunflower (Helianthus annuus) is a tall, sun-loving plant with bright yellow petals and a dark central disk, 
          known for its ability to track the sun and produce edible seeds.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Ensure at least 6-8 hours of direct sun daily.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Water deeply when the top inch of soil is dry. Avoid overwatering.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🥄</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Support</Text>
            <Text style={styles.tipText}>
              Stake tall varieties to prevent them from toppling.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Lemon Tree Plant Detail Screen
function LemonTreeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lemon Tree</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/84r4KC2F/b2.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          A lemon tree (Citrus limon) is a citrus plant known for its bright yellow, tangy fruits, glossy green leaves, 
          and fragrant white blossoms, often grown for its fruit and ornamental appeal.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Needs 6–8 hours of full sun daily.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Keep soil consistently moist but not waterlogged; water deeply when the top 1–2 inches are dry.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🍀</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Fertilizer</Text>
            <Text style={styles.tipText}>
              Feed with a citrus-specific fertilizer every few months.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Capsicum Plant Detail Screen
function CapsicumScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bell Peppers</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/zHTjx93h/images-9.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Bell peppers (Capsicum annuum) are sweet, crunchy vegetables available in vibrant colors like green, red, yellow, 
          and orange, commonly used in cooking and salads.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Requires 6–8 hours of full sun daily.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Keep the soil evenly moist but not soggy; water when the top inch feels dry.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🌱</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Fertilizer</Text>
            <Text style={styles.tipText}>
              Use a balanced fertilizer with higher phosphorus to promote fruiting.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Strawberry Plant Detail Screen
function StrawberryScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Strawberries</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://cdn.pixabay.com/photo/2016/04/15/08/04/strawberry-1330459_1280.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          Strawberries (Fragaria x ananassa) are sweet, red, heart-shaped fruits loved for their juicy flavor, 
          grown on low, trailing plants with white flowers.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Requires 6–8 hours of full sun daily.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Keep soil consistently moist but not soggy; water at the base to avoid leaf diseases.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🌱</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Fertilizer</Text>
            <Text style={styles.tipText}>
              Feed with a balanced fertilizer during growth and fruiting.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Hibiscus Plant Detail Screen
function HibiscusScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.plantDetailContainer}>
      <View style={styles.standardHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hibiscus</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.plantDetailContent}>
        <Image 
          source={{ uri: 'https://i.ibb.co/hRW7pJV1/b4.jpg' }} 
          style={styles.plantDetailImage} 
        />

        <Text style={styles.plantDetailDescription}>
          These flowering plants come in various colors and varieties, offering a range of options to suit your aesthetic preferences. 
          In addition to their visual appeal, Hibiscus plants are relatively easy to care for, making them a favored choice among garden enthusiasts.
        </Text>

        <Text style={styles.careTipsTitle}>🌿 Care Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☀️</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Light</Text>
            <Text style={styles.tipText}>
              Provide ample sunlight, at least six hours of direct sun daily.
            </Text>
          </View>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Water fortnightly</Text>
            <Text style={styles.tipText}>
              Keep the soil consistently moist, avoiding overwatering or waterlogging.
            </Text>
          </View>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🌱</Text>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipTitle}>Fertilizer</Text>
            <Text style={styles.tipText}>
              Feed regularly with a balanced, slow-release fertilizer during the growing season.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  standardHeader: {
    backgroundColor: '#8BC34A',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#5c815d',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    marginRight: 15,
  },
  welcomeText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  location: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  section: {
    padding: width * 0.05,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  seeAll: {
    fontSize: width * 0.035,
    color: '#555',
  },
  serviceCardWrap: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceCardHorizontal: {
    width: width * 0.5,
    marginRight: 10,
  },
  serviceImageHorizontal: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  serviceLabel: {
    textAlign: 'center',
    marginTop: 6,
    fontWeight: 'bold',
  },
  serviceCard: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 8,
  },
  newsCard: {
    backgroundColor: '#fff6e9',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  newsImage: {
    width: '100%',
    height: width * 0.5,
  },
  newsTextContainer: {
    padding: 12,
  },
  newsText: {
    fontSize: width * 0.035,
    color: '#333',
    textAlign: 'center',
  },
  settingItem: {
    fontSize: width * 0.04,
    marginVertical: 6,
    paddingLeft: 10,
  },
  navIcon: {
    fontSize: width * 0.06,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    margin: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  // Authentication styles
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8DBF8D',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#F8F8F8',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#F8F8F8',
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6FBF7F',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: '#F8F8F8',
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  // About Us styles
  aboutHeader: {
    backgroundColor: '#7a996d',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  aboutHeaderText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  aboutContent: {
    padding: 20,
  },
  aboutImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#355d2a',
    marginTop: 15,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 10,
  },
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 15,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
  // FAQ styles
  faqHeader: {
    backgroundColor: '#7a996d',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  faqHeaderText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  introBox: {
    padding: 16,
    alignItems: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  faqItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  faqImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  faqTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  faqQuestion: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#355d2a',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#333',
  },
  // Plant Library styles
  plantLibraryContainer: {
    flex: 1,
    backgroundColor: '#f8f1d8',
  },
  plantLibraryHeader: {
    backgroundColor: '#8BC34A',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  plantLibraryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  plantSearch: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    padding: 10,
  },
  plantFilters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#8BC34A',
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  plantList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  plantCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  plantType: {
    fontWeight: 'bold',
    color: '#444',
  },
  plantName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  // To-Do List styles
  todoContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  todoHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  todoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  addTaskContainer: {
    flexDirection: 'row',
    margin: 16,
    alignItems: 'center',
  },
  addTaskInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  taskList: {
    flex: 1,
    marginHorizontal: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  taskCheckbox: {
    marginRight: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  
  // Volunteering styles
  volunteerHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  volunteerHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  volunteerIntro: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    padding: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  opportunityCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  opportunityImage: {
    width: '100%',
    height: 150,
  },
  opportunityDetails: {
    padding: 16,
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  opportunityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  opportunityDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginVertical: 10,
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Plant Detail styles
  plantDetailContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  plantDetailHeader: {
    backgroundColor: '#7ca982',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  plantDetailTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  plantDetailContent: {
    padding: 16,
  },
  plantDetailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 16,
  },
  plantDetailDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  careTipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileHeader: {
    backgroundColor: '#7ca982',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapFallbackText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  mapFallbackButton: {
    backgroundColor: '#6FBF7F',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  mapFallbackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapFallbackImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  successModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  successModalText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 10,
  },
});