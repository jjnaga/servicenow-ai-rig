# Local runner

`run-once` is a cold, outbound queue poller. It uses the fixture adapter by default and must stay
unscheduled until a human authorizes installation of a LaunchAgent after a live fixture proof.

The runner accepts only the action enum defined in `adapters.py`, uses a non-blocking `fcntl` lock,
confirms the exact authorized PDI host from the private env file, and invokes providers with argv
arrays and `shell=False`. It never makes a Gate 1/Gate 2 decision.
