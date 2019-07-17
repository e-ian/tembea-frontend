import { Component, Output, EventEmitter, OnInit, } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProviderModel } from '../../../shared/models/provider.model';
import { ProviderService } from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import { SlackService } from '../../__services__/slack.service';
import { IChannel } from '../../../shared/models/channel.model';

@Component({
  templateUrl: './add-provider-modal.component.html',
  styleUrls: [
    './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss',
    './add-provider-modal.component.scss',
  ]
})

export class AddProviderModalComponent implements OnInit {
  providerData: ProviderModel;
  loading: boolean;
  isDirectMessage: boolean;
  channelId: string;
  channels: IChannel[] = [];
  @Output() executeFunction = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddProviderModalComponent>,
    public providerService: ProviderService,
    public alert: AlertService,
    private appEventService: AppEventService,
    public slackService: SlackService
  ) {
    this.providerData = new ProviderModel('', '');
  }

  ngOnInit() {
    this.isDirectMessage = true;
    this.loadChannels();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logError(error) {
    if (error && error.status === 404) {
      this.alert.error('Provider user email entered does not exist');
    } else if (error && error.status === 409) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else {
      this.alert.error('Something went wrong, please try again');
    }
  }

  addProvider(): void {
    if (!this.isDirectMessage && !this.channelId) {
      return this.alert.error('Please select a channel');
    }

    this.loading = true;
    const providerData = this.getProviderData();
    this.providerService.add(providerData).subscribe(
      (responseData) => {
        if (responseData.success) {
          this.alert.success(responseData.message);
          this.appEventService.broadcast({ name: 'newProvider' });
          this.loading = false;
          this.dialogRef.close();
        }
      },
      (error) => {
        this.logError(error);
        this.loading = false;
      }
    );
  }

  getProviderData() {
    return {
      ...this.providerData,
      isDirectMessage: this.isDirectMessage,
      channelId: this.channelId,
    };
  }

  loadChannels() {
    this.slackService.getChannels().subscribe((response) => {
      if (response.success) {
        this.channels = response.data;
      }
    });
  }

  toggleNotification(value: string) {
    if (value === 'direct_message') {
      this.isDirectMessage = true;
      this.channelId = null;
    } else {
      this.isDirectMessage = false;
    }
  }
}
