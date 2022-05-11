export interface IpushNotification {
  to?: string;
  registration_ids?: string[];
  condition?: string;
  collapse_key?: string;
  priority?: string;
  content_available?: boolean;
  mutable_content?: any;
  time_to_live?: number;
  restricted_package_name?: string;
  dry_run?: boolean;

  data?: any;
  notification?: INotification;
}

interface INotification {
  title?: string;
  body?: string;
  android_channel_id?: string;
  icon?: string;
  sound?: string;
  tag?: string;
  color?: string;
  click_action?: string;
  body_loc_key?: string;
  title_loc_key?: string;
}
