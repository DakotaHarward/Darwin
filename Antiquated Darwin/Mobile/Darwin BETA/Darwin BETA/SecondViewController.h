//
//  SecondViewController.h
//  Darwin BETA
//
//  Created by Dakota Kay Harward on 8/4/15.
//  Copyright © 2015 Avinity Corporation. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SecondViewController : UIViewController
{
    
}

@property (nonatomic, retain) NSInputStream *inputStream;
@property (nonatomic, retain) NSOutputStream *outputStream;

- (IBAction)resetConnection:(id)sender;
- (IBAction)testButton:(id)sender;


@end

