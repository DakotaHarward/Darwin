//
//  ViewController.h
//  Darwin
//
//  Created by Dakota Kay Harward on 8/3/15.
//  Copyright © 2015 Avinity Corporation. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController
{
}

@property (nonatomic, retain) NSInputStream *inputStream;
@property (nonatomic, retain) NSOutputStream *outputStream;

- (IBAction)testMessage:(id)sender;
- (IBAction)resetConnection:(id)sender;



@end

