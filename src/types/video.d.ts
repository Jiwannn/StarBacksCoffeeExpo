declare module 'react-native-video' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';
  
  interface VideoProps {
    source: { uri: string } | number;
    paused?: boolean;
    repeat?: boolean;
    muted?: boolean;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
    style?: ViewStyle;
    onLoad?: () => void;
    onError?: (error: any) => void;
  }
  
  export default class Video extends Component<VideoProps> {}
}