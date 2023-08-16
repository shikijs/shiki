with
    Ada.Text_IO,
    Ada.Integer_Text_IO;
use Ada;

procedure fizz_buzz is
begin
    for i in 1..100 loop
        if i mod 15 = 0 then
            Text_IO.Put_Line("fizz buzz");
        elsif i mod 5 = 0 then
            Text_IO.Put_Line("buzz");
        elsif i mod 3 = 0 then
            Text_IO.Put_Line("fizz");
        else
            Integer_Text_IO.put(i, Width => 0);
            Text_IO.New_Line;
        end if;
    end loop;
end fizz_buzz;

-- From https://github.com/kylelk/ada-examples/blob/master/fizz_buzz.adb
