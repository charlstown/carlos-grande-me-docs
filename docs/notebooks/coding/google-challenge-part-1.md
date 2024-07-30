# Google challenge part 1

<div class='image-caption image-centered image-width-24' markdown>

- ![Google Data Center 2079 By Beeple Crap](https://carlosgrande.me/wp-content/uploads/2022/03/BeepleCrap_GOOGLE-DATA-CENTER-2079.jpg)
- Google Data Center 2079 By Beeple Crap
{ .caption }

</div>


I've been recently working with my friend [Álvaro Simón Merino](https://alvarosimon.me/) doing some research in Google about coding. We got an unusual message on the google site background, with a message:
> You're speaking our language. Up for a challenge?

At first, we thought it was fake, a virus, or something like that. Then we realize the site was official! We could not believe to see Google sending us a challenge to solve and we accepted it immediately! Clicking on “I want to play” landed us on Google’s Foobar page...

<div class="image-caption" markdown>

- ![Google Foobar](https://carlosgrande.me/wp-content/uploads/2022/03/GoogleFooBar-1.png)
- Google Foobar
{ .caption }

</div>


## What is Google Foobar

Google Foobar challenge is a secret hiring process by the company to recruit top programmers and developers around the world. It is known that several developers at Google were hired by this process. To access to Foobar challenge you need to hit the secret key search pattern or be invited by someone that has reached level 3.

The challenge consists of five levels with a total of nine questions, with the level of difficulty increasing at each level.

This is how the Google Foobar begins:

> Why did you sign up for infiltration duty again? The pamphlets from Bunny HQ promised exotic and interesting missions, yet here you are drudging in the lowest level of Commander Lambda's organization. Hopefully you get that promotion soon...


## Level I

### Challenge 1: I Love Lance & Janice

You've caught two of your fellow minions passing coded notes back and forth -- while they're on duty, no less! Worse, you're pretty sure it's not job-related -- they're both huge fans of the space soap opera ""Lance & Janice"". You know how much Commander Lambda hates waste, so if you can prove that these minions are wasting time passing non-job-related notes, it'll put you that much closer to a promotion. 

Fortunately for you, the minions aren't exactly advanced cryptographers. In their code, **every lowercase letter [a..z] is replaced with the corresponding one in [z..a], while every other character (including uppercase letters and punctuation) is left untouched**.  That is, 'a' becomes 'z', 'b' becomes 'y', 'c' becomes 'x', etc.  For instance, the word ""vmxibkgrlm"", when decoded, would become ""encryption"".

Write a function called solution(s) which takes in a string and returns the deciphered string so you can show the commander proof that these minions are talking about ""Lance & Janice"" instead of doing their jobs.


### Python cases

Your code should pass the following test cases.
Note that it may also be run against hidden test cases not shown here.

**Test 01:**
```py
# Input
solution.solution("wrw blf hvv ozhg mrtsg'h vkrhlwv?")

# Output
"did you see last night's episode?"
```

**Test 02:**
```py
# Input
solution.solution("Yvzs! I xzm'g yvorvev Lzmxv olhg srh qly zg gsv xlolmb!!")

# Output
"Yeah! I can't believe Lance lost his job at the colony!!"
```


### Resolution

The first challenge was surprisingly easy. An **atbash cipher!!** By reversing the alphabet such that each letter is mapped to the letter in the same position in the reverse of the alphabet. Symbols and numbers are left intact in the same position.

```py
def solution(x):
    # Define a string with the alphabet
    alpha = "abcdefghijklmnopqrstuvwxyz"
    # Reverse the alphabet string
    alpha_reverse = alpha[::-1]
    # Generate a mapped dictionary
    abc_map = dict(zip(alpha, alpha_reverse))
    # Decode de message in a loop
    decode_lst = [abc_map[letter] if letter in alpha else letter for letter in x]
    # Join back the message in a string
    decode_message = ''.join(decode_lst)
    return decode_message
```
```
solution("wrw blf hvv ozhg mrtsg'h vkrhlwv?")
```
*"did you see last night's episode?"*


## Level II
### Challenge 2: Bunny Worker Locations

Keeping track of Commander Lambda's many bunny workers is starting to get tricky. You've been tasked with writing a program to match bunny worker IDs to cell locations.

The LAMBCHOP doomsday device takes up much of the interior of Commander Lambda's space station, and as a result the work areas have an unusual layout. They are stacked in a **triangular shape**, and the bunny workers are **given numerical IDs starting from the corner**, as follows:
```
| 7
| 4 8
| 2 5 9
| 1 3 6 10
```
Each cell can be represented as points (x, y), with **x being the distance from the vertical wall, and y being the height from the ground.** 

For example, the bunny worker at (1, 1) has ID 1, the bunny worker at (3, 2) has ID 9, and the bunny worker at (2,3) has ID 8. This pattern of numbering continues indefinitely (Commander Lambda has been adding a LOT of workers). 

Write **a function solution(x, y) which returns the worker ID of the bunny at location (x, y). Each value of x and y will be at least 1 and no greater than 100,000.** Since the worker ID can be very large, return your solution as a string representation of the number.


### Test cases
Your code should pass the following test cases.
Note that it may also be run against hidden test cases not shown here.

**Test 01:**
```
# Input
solution.solution("wrw blf hvv ozhg mrtsg'h vkrhlwv?")

# Output
"did you see last night's episode?"
```

**Test 02:**
```
# Input
solution.solution("Yvzs! I xzm'g yvorvev Lzmxv olhg srh qly zg gsv xlolmb!!")

# Output
"Yeah! I can't believe Lance lost his job at the colony!!"
```

### Resolution
The second challenge was easy too, but way more interesting. It purposes a triangular sequence represented with numbers, where you need to map the location of each number by coordinates returning the index of the position.

![Google challenge 02](https://carlosgrande.me/wp-content/uploads/2022/03/challenge02-1.png)
*Google challenge 02*


In my opinion, you can approach this challenge from multiple sides. The key, as always, is to divide the problem into smaller problems. So in my case, first I create a rule to get the row index in the triangle by summing both coordinates:
- line 1 -> (1, 1) -> (1+1) - 1 row
- line 2 -> (1, 2), (2, 1) -> (1+2) - 1 row

Next, to get the previous value from a row you can sum the recursive sequence of that row:
- line 3 -> (1, 3), (2, 2), (3, 1) -> 4 row - 2 row = 2
- row -> 1 + 2 = 3

Finally, I realized that by adding the X coordinate to the last number of a row, you can get the actual position:
- (2, 3) -> (2+3) - 2 row = 3 row -> 1 + 2 + 3 = 6 -> 6 + 2 = 8

So to sum up:
- coordinate-> (2, 3)
- Previous -> 1+2+3 = 6
- Value -> 6 + 2 = 8

```
def solution(x, y):
    line = x + y -1
    start_line = sum([i for i in range(line)])
    worker_id = str(start_line + x)
    return worker_id
```
```
solution(2, 3)
```
*"8"*


### Challenge 2: Don't Get Volunteered!

As a henchman on Commander Lambda's space station, you're expected to be resourceful, smart, and a quick thinker. It's not easy building a doomsday device and ordering the bunnies around at the same time, after all! In order to make sure that everyone is sufficiently quick-witted, Commander Lambda has installed new flooring outside the henchman dormitories. It looks like **a chessboard**, and every morning and evening you have to solve a new movement puzzle in order to cross the floor. That would be fine if you got to be the rook or the queen, but instead, **you have to be the knight**. Worse, if you take too much time solving the puzzle, you get "volunteered" as a test subject for the LAMBCHOP doomsday device!

To help yourself get to and from your bunk every day, write a function called solution(src, dest) which **takes in two parameters: the source square, on which you start, and the destination square, which is where you need to land** to solve the puzzle.  The function should **return an integer representing the smallest number of moves it will take for you to travel from the source square to the destination square using a chess knight's moves** (that is, two squares in any direction immediately followed by one square perpendicular to that direction, or vice versa, in an "L" shape).  **Both the source and destination squares will be an integer between 0 and 63**, inclusive, and are numbered like the example **chessboard below:**
```
-------------------------
| 0| 1| 2| 3| 4| 5| 6| 7|
-------------------------
| 8| 9|10|11|12|13|14|15|
-------------------------
|16|17|18|19|20|21|22|23|
-------------------------
|24|25|26|27|28|29|30|31|
-------------------------
|32|33|34|35|36|37|38|39|
-------------------------
|40|41|42|43|44|45|46|47|
-------------------------
|48|49|50|51|52|53|54|55|
-------------------------
|56|57|58|59|60|61|62|63|
-------------------------
```

### Test cases

Your code should pass the following test cases.
Note that it may also be run against hidden test cases not shown here.

**Test 01:**
```
# Input
solution.solution(19, 36)

# Output
1
```

**Test 02:**
```
# Input
solution.solution(0, 1)

# Output
3
```

### Resolution
The third challenge was a great challenge. I enjoy solving this one. Given a chessboard, you need to write a function that calculates the smallest number of moves from one square to another square as a  chess knight.

I'm sure you can apply more rules and optimize this solution. Although, in my case, I solved by extracting all the possible moves from the initial position and recursively calculating all possible moves from these new positions, until I reached the destination square.

[caption width="450" align="aligncenter"]<img src="https://carlosgrande.me/wp-content/uploads/2022/03/Challenge_3.gif" width="600" height="600" alt="Google challenge 3" class="size-medium" /> Google challenge 3[/caption]

So to do that I start with a structure like this:
```
next_moves = [src]
moves_counter = 0
# Only stops is destination is reached in next moves
while dest not in next_moves:
    all_moves = []
	# For each position in next_moves it calculate all possible next positions
    for position in next_moves:
        moves = possible_moves(position)	# A function to calculate all possible moves
        all_moves += moves	# Add to all moves the next moves
    next_moves = all_moves	# Next moves is reset with the accumulated new moves
    moves_counter += 1
```

Instead of creating functions inside the main function, I tried to develop the code along with the previous struture as short and clear as possible.
```
def solution(src, dest):
    possible_moves = [(2, 1), (1, 2), (-1, 2), (2, -1), (-2, 1), (1, -2), (-1, -2), (-2, -1)]
    lines = [list(range(8*i, 8*i+8)) for i in range(0, 8)]
    next_moves = [src]
    moves_counter = 0
    while dest not in next_moves:
        all_moves = []
        for position in next_moves:
            # Possible moves
            idx = int(position/8), (position % 8)
            solutions = [(idx[0] + move[0], idx[1] + move [1]) for move in possible_moves\
                         if 0 <= idx[0] + move[0] < 8 and 0 <= idx[1]+ move[1] < 8]
            moves = [lines[coor[0]][coor[1]] for coor in solutions]
            all_moves += moves
        next_moves = all_moves
        moves_counter += 1
    return moves_counter
```
```
solution(0, 7)
```
*5*


---

## References and links

- Download the Jupyter notebook from: [github.com/charlstown/MyGoogleFooBar](https://github.com/charlstown/MyGoogleFooBar)
- [Google Foobar official](https://foobar.withgoogle.com/)
- [More Notebooks like this here](https://carlosgrande.me/category/myworks/notebooks/)